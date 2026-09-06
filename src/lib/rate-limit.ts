// Rate limiting anti-bruteforce — en mémoire (reset au redémarrage du process).
// Suit les tentatives de connexion par clé (IP + identifiant) :
//   - Seuil en douceur : blocage temporaire jusqu'à expiration de la fenêtre.
//   - Seuil dur : blocage allongé (15 min).
// À terme, remplacer par Redis pour un comportement multi-instance.

const WINDOW_MS = 10 * 60 * 1000; // fenêtre de 10 minutes
const SOFT_LIMIT = 5; // tentatives autorisées avant blocage
const HARD_LIMIT = 12; // tentatives avant blocage dur
const HARD_BLOCK_MS = 15 * 60 * 1000; // blocage dur supplémentaire
const MAX_ENTRIES = 100; // garde-fou mémoire

type Entry = {
  attempts: number[];
  hardBlockUntil: number;
};

const store = new Map<string, Entry>();

function now(): number {
  return Date.now();
}

function prune(entry: Entry, ts: number) {
  entry.attempts = entry.attempts.filter((t) => ts - t < WINDOW_MS);
}

export function recordAttempt(key: string) {
  const ts = now();
  let entry = store.get(key);
  if (!entry) {
    entry = { attempts: [], hardBlockUntil: 0 };
    store.set(key, entry);
  }
  prune(entry, ts);
  entry.attempts.push(ts);
  if (entry.attempts.length >= HARD_LIMIT && entry.hardBlockUntil === 0) {
    entry.hardBlockUntil = ts + HARD_BLOCK_MS;
  }

  // Garde-fou mémoire : évacue une entrée si trop nombreuses
  if (store.size > MAX_ENTRIES) {
    const oldest = store.entries().next().value;
    if (oldest) store.delete(oldest[0]);
  }
}

export function tooManyAttempts(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const ts = now();
  const entry = store.get(key);
  if (!entry) return { blocked: false, retryAfterSeconds: 0 };

  prune(entry, ts);
  if (entry.attempts.length === 0) {
    store.delete(key);
    return { blocked: false, retryAfterSeconds: 0 };
  }

  const attempts = entry.attempts.length;

  if (attempts >= HARD_LIMIT && entry.hardBlockUntil > ts) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.hardBlockUntil - ts) / 1000),
    };
  }

  if (attempts >= SOFT_LIMIT) {
    // Bloqué jusqu'à la sortie de la fenêtre de la tentative la plus ancienne
    const oldest = entry.attempts[0];
    const retry = Math.ceil((oldest + WINDOW_MS - ts) / 1000);
    return { blocked: true, retryAfterSeconds: Math.max(0, retry) };
  }

  return { blocked: false, retryAfterSeconds: 0 };
}

export function resetAttempts(key: string) {
  store.delete(key);
}

export function rateLimitKey(ip: string, identifier: string): string {
  return `${ip}|${identifier}`;
}

export function getClientIp(req: {
  headers: Headers | {
    get(name: string): string | null;
  };
}): string {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return h.get("x-real-ip") || "unknown";
}