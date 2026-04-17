# Documentation Technique — Solimouv' PWA

Documentation complète de l'application web progressive du festival **Solimouv'**.

---

## Table des matières

1. [Architecture](#architecture)
2. [Stack technique](#stack-technique)
3. [Installation & démarrage](#installation--démarrage)
4. [Variables d'environnement](#variables-denvironnement)
5. [Structure du projet](#structure-du-projet)
6. [Base de données (Supabase)](#base-de-données-supabase)
7. [Pages & routes](#pages--routes)
8. [Composants](#composants)
9. [Système de passeport & points](#système-de-passeport--points)
10. [PWA & Service Worker](#pwa--service-worker)
11. [Déploiement](#déploiement)
12. [Conventions de code](#conventions-de-code)

---

## Architecture

```
Browser (PWA)
    │
    ▼
Next.js 16 App Router (Vercel Edge)
    │
    ├── Pages React (SSR / SSG / Client)
    ├── API Routes (formulaires, webhooks)
    │
    ▼
Supabase
    ├── PostgreSQL (données principales)
    ├── Auth (email / magic link)
    ├── Realtime (classement live)
    └── Row Level Security (isolation par user)
```

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 16.2.4 | Framework fullstack, App Router |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styles utilitaires mobile-first |
| Supabase JS | 2.x | Client BDD + Auth + Realtime |
| next-pwa / Workbox | 5.x | Service Worker, manifest, cache offline |
| Vercel | — | Hébergement & déploiement continu |

---

## Installation & démarrage

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd solimouv-pwa

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir les valeurs (voir section suivante)

# 4. Initialiser la base de données
# → Copier supabase/schema.sql dans l'éditeur SQL Supabase et exécuter

# 5. Lancer le serveur de développement
npm run dev
# → http://localhost:3000

# 6. Build de production
npm run build
npm start
```

---

## Variables d'environnement

| Variable | Description | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase | Oui |
| `NEXT_PUBLIC_SOCIAL_INSTAGRAM` | Lien Instagram Solimouv' | Non |
| `NEXT_PUBLIC_SOCIAL_LINKEDIN` | Lien LinkedIn Solimouv' | Non |
| `NEXT_PUBLIC_SOCIAL_TIKTOK` | Lien TikTok Solimouv' | Non |

Les variables préfixées `NEXT_PUBLIC_` sont exposées côté client.

---

## Structure du projet

```
solimouv-pwa/
│
├── app/                          # Pages (Next.js App Router)
│   ├── layout.tsx                # Root layout : fonts, metadata, AppShell
│   ├── page.tsx                  # Page d'accueil (hero, parcours, CTA)
│   ├── about/page.tsx            # À propos d'Up Sport! Paris
│   ├── admin/page.tsx            # Tableau de bord administrateur
│   ├── associations/page.tsx     # Annuaire des associations partenaires
│   ├── auth/page.tsx             # Authentification (signup / login)
│   ├── classement/page.tsx       # Classement annuel Soli'Passeport
│   ├── contact/page.tsx          # Formulaire de contact
│   ├── defis/page.tsx            # Défis mensuels Soli'Skills
│   ├── don/page.tsx              # Dons en ligne
│   ├── match/page.tsx            # Matching sportif (algorithme)
│   ├── offline/page.tsx          # Fallback PWA hors connexion
│   ├── passeport/page.tsx        # Soli'Passeport personnel
│   ├── programme/page.tsx        # Programme de la journée festival
│   ├── quiz/page.tsx             # Quiz sport inclusif
│   └── scan/page.tsx             # Scanner QR code des stands
│
├── components/                   # Composants réutilisables
│   ├── AppShell.tsx              # Shell global (Navbar + BottomNav + Footer)
│   ├── BottomNav.tsx             # Navigation mobile bas d'écran
│   ├── Footer.tsx                # Pied de page
│   ├── Navbar.tsx                # Barre de navigation desktop
│   └── PageHero.tsx              # Bandeau titre de page
│
├── lib/
│   └── supabase.ts               # Client Supabase + types TypeScript
│
├── public/
│   ├── manifest.json             # Manifest PWA (nom, icônes, couleur)
│   └── icons/                    # Icônes 192×192 et 512×512
│
├── supabase/
│   └── schema.sql                # Schéma PostgreSQL, RLS, seed
│
├── next.config.ts                # Config Next.js (PWA, webpack)
├── postcss.config.mjs            # Config PostCSS / Tailwind
└── tsconfig.json                 # Config TypeScript
```

---

## Base de données (Supabase)

### Tables principales

| Table | Description |
|---|---|
| `passport_profiles` | Profil Soli'Passeport de chaque utilisateur (nom, sport préféré, points) |
| `passport_scans` | Historique des scans QR (user × stand × timestamp) |
| `festival_stands` | Stands du festival (nom, catégorie, description, QR code) |
| `monthly_challenges` | Défis mensuels publiés par l'admin |
| `challenge_participations` | Participations des users aux défis |
| `associations` | Associations partenaires du festival |

### Sécurité (Row Level Security)

Chaque table active la RLS Supabase :
- Un utilisateur ne peut lire/modifier **que ses propres données**.
- L'admin (rôle `service_role`) a un accès complet.

### Client TypeScript

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types exportés
export type PassportProfile = { ... };
export type PassportScan = { ... };
export type FestivalStand = { ... };
export type MonthlyChallenge = { ... };
export type ChallengeParticipation = { ... };
```

---

## Pages & routes

| Route | Rendu | Auth requise | Description |
|---|---|---|---|
| `/` | SSG | Non | Page d'accueil marketing |
| `/about` | SSG | Non | Présentation Up Sport! Paris |
| `/programme` | SSR | Non | Programme de la journée |
| `/associations` | SSR | Non | Annuaire des associations |
| `/contact` | Client | Non | Formulaire de contact |
| `/auth` | Client | Non | Inscription / connexion |
| `/passeport` | Client | Oui | Passeport personnel + badges |
| `/scan` | Client | Oui | Scan QR code stand |
| `/defis` | Client | Oui | Défis mensuels |
| `/classement` | SSR | Non | Classement global |
| `/quiz` | Client | Non | Quiz sport inclusif |
| `/match` | Client | Non | Matching sportif |
| `/don` | Client | Non | Dons |
| `/admin` | Client | Admin | Dashboard admin |
| `/offline` | Static | Non | Fallback offline PWA |

---

## Composants

### `AppShell`
Enveloppe globale chargée dans `layout.tsx`. Gère l'affichage conditionnel de la `Navbar` (desktop) et `BottomNav` (mobile).

### `BottomNav`
Navigation principale mobile, fixée en bas d'écran. Liens : Accueil, Passeport, Scan, Défis, Classement.

### `Navbar`
Barre de navigation desktop avec les liens principaux et le bouton de connexion.

### `PageHero`
Composant de bandeau titre réutilisable pour les pages internes (titre + sous-titre + couleur d'accent).

---

## Système de passeport & points

### Scan de stands
1. L'utilisateur ouvre `/scan` et scanne le QR code d'un stand festival.
2. La route vérifie que l'utilisateur a un passeport et que le stand n'a pas déjà été scanné.
3. Si valide : insertion dans `passport_scans` + appel à `addPassportPoints(userId, points)`.

### Badges automatiques
Les badges sont calculés côté client à partir de l'historique de scans :

| Badge | Condition |
|---|---|
| Explorateur | 1er stand scanné |
| Découverte | Stand catégorie "handisport" scanné |
| *(autres)* | Définis dans `passeport/page.tsx` |

### Défis mensuels
- Publiés par l'admin dans la table `monthly_challenges`.
- L'utilisateur valide un défi → insertion dans `challenge_participations` + points.
- Suggestions de sports générées localement selon le sport préféré du profil.

### Classement
- Agrégation des points de tous les `passport_profiles`.
- Affichage live via Supabase Realtime (subscription sur la table).

---

## PWA & Service Worker

L'application est configurée comme PWA via `next-pwa` :

- **Manifest** : `/public/manifest.json` (nom, couleur `#5f2482`, icônes)
- **Service Worker** : généré automatiquement par Workbox au build
- **Cache offline** : pages statiques mises en cache, fallback sur `/offline`
- **Installation** : prompt natif sur mobile (Android/iOS)

---

## Déploiement

### Vercel (recommandé)

```bash
# Déploiement de production
vercel --prod
```

Variables à configurer dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Build manuel

```bash
npm run build   # Build Next.js optimisé
npm start       # Serveur Node.js de production (port 3000)
```

---

## Conventions de code

- **TypeScript strict** — pas de `any` implicite.
- **Composants Client** — marqués `"use client"` uniquement si hooks/events requis.
- **Composants Serveur** — par défaut pour les pages SSR/SSG (fetch + metadata).
- **Tailwind** — classes utilitaires, pas de CSS custom sauf dans `globals.css`.
- **Supabase** — toujours gérer les erreurs (`const { data, error } = await supabase...`).
- **Images externes** — `loading="lazy"` sauf hero (eager).
- **Accessibilité** — `aria-label` sur tous les éléments interactifs sans texte visible.

---

*Up Sport! Paris — Festival Solimouv' 2026*
