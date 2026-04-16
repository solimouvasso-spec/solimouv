# Solimouv' PWA

Application web progressive (PWA) du **Festival Solimouv'** — festival du sport inclusif organisé par **Up Sport! Paris**.

---

## Stack

| Technologie | Usage |
|---|---|
| Next.js 16 App Router + TypeScript | Framework frontend |
| Tailwind CSS v4 | Styles (mobile-first) |
| Supabase (Postgres + Auth + Realtime) | Base de données & auth |
| next-pwa + Workbox | Service worker & manifest |
| Rust → WebAssembly | Algorithme de matching sportif |
| Vercel | Déploiement |

---

## Démarrage rapide

```bash
# 1. Cloner et installer
cd solimouv-pwa
npm install

# 2. Variables d'environnement
cp .env.example .env.local
# → remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Initialiser la base de données
# → Copier supabase/schema.sql dans l'éditeur SQL Supabase

# 4. Développement
npm run dev

# 5. Build de production
npm run build
npm start
```

---

## Structure

```
solimouv-pwa/
├── app/
│   ├── layout.tsx              Root layout (Navbar + Footer + metadata)
│   ├── page.tsx                Page d'accueil (hero, highlights, CTA)
│   ├── about/page.tsx          À propos d'Up Sport! Paris
│   ├── programme/page.tsx      Programme de la journée
│   ├── associations/page.tsx   Annuaire des associations partenaires
│   ├── contact/page.tsx        Formulaire de contact
│   ├── match/page.tsx          Matching sportif (placeholder Wasm)
│   ├── quiz/page.tsx           Quiz sport inclusif
│   ├── don/page.tsx            Dons en ligne
│   └── admin/page.tsx          Tableau de bord admin
├── components/
│   ├── Navbar.tsx              Navigation responsive + mobile
│   └── Footer.tsx              Pied de page
├── lib/
│   └── supabase.ts             Client Supabase + types TypeScript
├── public/
│   ├── manifest.json           Manifest PWA
│   └── icons/                  Icônes 192x192 et 512x512
├── supabase/
│   └── schema.sql              Schéma PostgreSQL + RLS + seed
└── .env.example                Variables d'environnement
```

---

## Palette & design

| Rôle | Valeur | Classe Tailwind |
|---|---|---|
| Background | `#0D1B2A` | `bg-navy` |
| Accent (rouge) | `#E63946` | `bg-accent` / `text-accent` |
| Teal | `#00C9A7` | `bg-teal` / `text-teal` |

---

## Roadmap

- [ ] Authentification admin (Supabase Auth magic link)
- [ ] Intégration Stripe pour les dons
- [ ] Algorithme de matching en Rust/Wasm
- [ ] Page `/offline` pour PWA fallback
- [ ] Notifications push (Service Worker)
- [ ] Internationalisation (fr / en)
- [ ] API routes pour formulaires (contact, dons)

---

## Déploiement Vercel

```bash
vercel --prod
```

Variables d'environnement à configurer dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

*Fait avec pour le sport inclusif — Up Sport! Paris*
