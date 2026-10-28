# FuturCraft Institut

Site web et outils de gestion de FuturCraft Institut, construit avec Next.js,
React, TypeScript, PostgreSQL et Drizzle ORM.

## Prérequis

- Node.js 20.9 ou supérieur
- pnpm 10.31.0
- PostgreSQL

Le projet utilise pnpm comme gestionnaire de paquets. Le fichier
`pnpm-lock.yaml` est le verrou de dépendances de référence.

## Installation locale

1. Installer les dépendances :

   ```sh
   corepack enable
   corepack prepare pnpm@10.31.0 --activate
   pnpm install --frozen-lockfile
   ```

2. Créer le fichier local d'environnement à partir du modèle :

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Renseigner au minimum `DATABASE_URL` et `ADMIN_PASSWORD` dans `.env.local`.
   `DATABASE_URL` doit pointer vers une base PostgreSQL dont le schéma est
   initialisé. Pour une base neuve, appliquer les fichiers SQL de `drizzle/`
   dans l'ordre numérique, avec `psql` et `ON_ERROR_STOP` activé. Par exemple,
   depuis PowerShell, après avoir remplacé la valeur par celle de
   `.env.local` :

   ```powershell
   $env:DATABASE_URL = "postgresql://utilisateur:mot-de-passe@localhost:5432/futurcraft"
   Get-ChildItem drizzle\*.sql | Sort-Object Name | ForEach-Object {
     psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f $_.FullName
     if ($LASTEXITCODE -ne 0) { throw "Échec de la migration $($_.Name)" }
   }
   ```

   L'application ajoute les données initiales lorsqu'elle détecte une base
   vide. `REDIS_URL` est facultatif en développement ; il est recommandé en
   production multi-instance pour partager le rate limit. `RESEND_API_KEY` est
   facultatif pour l'envoi effectif des e-mails.

3. Démarrer le serveur de développement :

   ```sh
   pnpm dev
   ```

   L'application est disponible à l'adresse <http://localhost:3000>.

## Vérifications

La compilation de production collecte les données de certaines pages : la base
PostgreSQL doit donc être configurée et accessible pendant `pnpm build`.

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Déploiement

Configurer les variables d'environnement nécessaires (`DATABASE_URL` et
`ADMIN_PASSWORD` au minimum) dans l'environnement de déploiement. Les rappels
automatiques sont planifiés par `vercel.json`. Les fichiers d'environnement
locaux ne doivent pas être committés.
