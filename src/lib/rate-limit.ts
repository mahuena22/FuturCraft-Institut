/**
 * Rate limiting anti-bruteforce.
 *
 * Deux backends :
 *   1. Redis (si REDIS_URL ou REDIS_HOST défini) → partagé entre instances, survives aux redémarrages.
 *   2. Mémoire (fallback) → strictement par process, perdu au redémarrage (suffisant en dev local).
 *
 * Règles :
 *   - Fenêtre glissante de 10 min.
 *   - Seuil doux (SOFT_LIMIT) : ≥5 tentatives → blocage jusqu'à expiration de la fenêtre.
 *   - Seuil dur (HARD_LIMIT) : ≥12 tentatives → blocage prolongé de 15 min.
 *   - Les erreurs Redis sont silencieuses : pas de blocage, juste un log d'avertissement.
 *     → on ne bloque jamais un utilisateur en cas de panne d'infra.
 */

import type { Redis as RedisClient } from "ioredis";

const WINDOW_MS = 10 * 60 * 1000;
const SOFT_LIMIT = 5;
const HARD_LIMIT = 12;
const HARD_BLOCK_MS = 15 * 60 * 1000;
const KEY_PREFIX = "fcrl:";
const MAX_ENTRIES = 100;

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface RateLimitStore {
  recordAttempt(key: string): Promise<void>;
  tooManyAttempts(key: string): Promise<{ blocked: boolean; retryAfterSeconds: number }>;
  resetAttempts(key: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Memory store (fallback)
// ---------------------------------------------------------------------------

type MemoryEntry = { attempts: number[]; hardBlockUntil: number };

class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, MemoryEntry>();

  private prune(entry: MemoryEntry, ts: number) {
    entry.attempts = entry.attempts.filter((t) => ts - t < WINDOW_MS);
  }

  async recordAttempt(key: string): Promise<void> {
    const ts = Date.now();
    let entry = this.store.get(key);
    if (!entry) {
      entry = { attempts: [], hardBlockUntil: 0 };
      this.store.set(key, entry);
    }
    this.prune(entry, ts);
    entry.attempts.push(ts);
    if (entry.attempts.length >= HARD_LIMIT && entry.hardBlockUntil === 0) {
      entry.hardBlockUntil = ts + HARD_BLOCK_MS;
    }
    if (this.store.size > MAX_ENTRIES) {
      const oldest = this.store.entries().next().value;
      if (oldest) this.store.delete(oldest[0]);
    }
  }

  async tooManyAttempts(key: string): Promise<{ blocked: boolean; retryAfterSeconds: number }> {
    const ts = Date.now();
    const entry = this.store.get(key);
    if (!entry) return { blocked: false, retryAfterSeconds: 0 };
    this.prune(entry, ts);
    if (entry.attempts.length === 0) {
      this.store.delete(key);
      return { blocked: false, retryAfterSeconds: 0 };
    }
    if (entry.attempts.length >= HARD_LIMIT && entry.hardBlockUntil > ts) {
      return { blocked: true, retryAfterSeconds: Math.ceil((entry.hardBlockUntil - ts) / 1000) };
    }
    if (entry.attempts.length >= SOFT_LIMIT) {
      const oldest = entry.attempts[0];
      const retry = Math.ceil((oldest + WINDOW_MS - ts) / 1000);
      return { blocked: true, retryAfterSeconds: Math.max(0, retry) };
    }
    return { blocked: false, retryAfterSeconds: 0 };
  }

  async resetAttempts(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Redis store
// ---------------------------------------------------------------------------

class RedisRateLimitStore implements RateLimitStore {
  constructor(private client: RedisClient) {}

  private blockKey(key: string): string {
    return `${KEY_PREFIX}${key}:block`;
  }

  private attemptsKey(key: string): string {
    return `${KEY_PREFIX}${key}:attempts`;
  }

  async recordAttempt(key: string): Promise<void> {
    try {
      const ts = Date.now();
      const ak = this.attemptsKey(key);
      await this.client
        .multi()
        .rpush(ak, String(ts))
        .pexpire(ak, WINDOW_MS)
        .exec();
      const count = await this.client.llen(ak);
      if (count >= HARD_LIMIT) {
        const expirySec = Math.ceil(HARD_BLOCK_MS / 1000);
        await this.client.set(this.blockKey(key), String(ts + HARD_BLOCK_MS), "EX", expirySec);
      }
    } catch (err) {
      console.error("[rate-limit:redis] recordAttempt error (fail-open) :", err);
    }
  }

  async tooManyAttempts(key: string): Promise<{ blocked: boolean; retryAfterSeconds: number }> {
    try {
      const [countRaw, hardBlockRaw, oldestRaw] = await Promise.all([
        this.client.llen(this.attemptsKey(key)),
        this.client.get(this.blockKey(key)),
        this.client.lindex(this.attemptsKey(key), 0),
      ]);

      const count = Number(countRaw);

      if (count >= SOFT_LIMIT) {
        const hardBlockExpiry = hardBlockRaw ? Number(hardBlockRaw) : 0;
        const now = Date.now();
        if (count >= HARD_LIMIT && hardBlockExpiry > now) {
          return { blocked: true, retryAfterSeconds: Math.ceil((hardBlockExpiry - now) / 1000) };
        }
        const oldest = oldestRaw ? Number(oldestRaw) : now;
        const retry = Math.ceil((oldest + WINDOW_MS - now) / 1000);
        return { blocked: true, retryAfterSeconds: Math.max(0, retry) };
      }

      return { blocked: false, retryAfterSeconds: 0 };
    } catch (err) {
      // En cas d'erreur Redis, ne pas bloquer l'utilisateur (fail-open).
      console.error("[rate-limit:redis] tooManyAttempts error (fail-open) :", err);
      return { blocked: false, retryAfterSeconds: 0 };
    }
  }

  async resetAttempts(key: string): Promise<void> {
    try {
      await this.client.del(this.attemptsKey(key), this.blockKey(key));
    } catch {
      // Silencieux : meilleure prédiction = ne rien casser.
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton store (lazy init)
// ---------------------------------------------------------------------------

let store: RateLimitStore | null = null;
let redisFallbackLogged = false;

async function getStore(): Promise<RateLimitStore> {
  if (store) return store;

  // Tenter Redis
  const url = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST;
  if (url || host) {
    try {
      // ioredis importé dynamiquement pour rester optionnel
      const Ioredis = (await import("ioredis")).default;
      const baseOpts = {
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy(times: number) {
          if (times > 3) return null; // céder la main au fallback mémoire
          return times * 500;
        },
      };
      const client = url
        ? new Ioredis(url, baseOpts)
        : new Ioredis({
            host,
            port: Number(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            db: Number(process.env.REDIS_DB || 0),
            ...baseOpts,
          });
      // Consomme les erreurs de connexion pour éviter tout « unhandled error event »
      client.on("error", () => {
        // silencieux : le ping ci-dessous décidera seul du fallback mémoire
      });
      try {
        await client.ping();
        store = new RedisRateLimitStore(client);
        console.log("[rate-limit] connecté à Redis ✓");
        return store;
      } catch {
        client.disconnect();
      }
    } catch (err) {
      if (!redisFallbackLogged) {
        console.warn("[rate-limit] connexion Redis échouée — fallback mémoire :", err);
        redisFallbackLogged = true;
      }
    }
  }

  store = new MemoryRateLimitStore();
  return store;
}

// ---------------------------------------------------------------------------
// API publique (compatibilité avec les routes existantes)
// ---------------------------------------------------------------------------

export async function recordAttempt(key: string): Promise<void> {
  (await getStore()).recordAttempt(key);
}

export async function tooManyAttempts(
  key: string
): Promise<{ blocked: boolean; retryAfterSeconds: number }> {
  return (await getStore()).tooManyAttempts(key);
}

export async function resetAttempts(key: string): Promise<void> {
  (await getStore()).resetAttempts(key);
}

export function rateLimitKey(ip: string, identifier: string): string {
  return `${ip}|${identifier}`;
}

export function getClientIp(req: { headers: Headers | { get(name: string): string | null } }): string {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}