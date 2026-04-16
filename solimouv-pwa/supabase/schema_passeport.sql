-- ============================================================
-- Solimouv' — Soli'Passeport & Gamification Schema
-- Up Sport! Paris
-- ============================================================

-- ─── Stands du festival (QR codes) ──────────────────────────────────────────
create table if not exists festival_stands (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  sport         text not null,
  category      text not null check (category in ('handisport', 'equipe', 'bienetre', 'culturel')),
  description   text,
  points        integer not null default 10,
  location      text,
  qr_code       text unique not null,
  active        boolean default true,
  festival_year integer not null default 2025
);

alter table festival_stands enable row level security;
create policy "Stands lisibles publiquement" on festival_stands for select using (true);
create policy "Admins gèrent les stands" on festival_stands for all using (auth.role() = 'authenticated');

-- ─── Profils Soli'Passeport ──────────────────────────────────────────────────
create table if not exists passport_profiles (
  id               uuid primary key default uuid_generate_v4(),
  session_id       text unique not null,
  display_name     text not null,
  email            text,
  total_points     integer not null default 0,
  festival_points  integer not null default 0,
  challenge_points integer not null default 0,
  festival_year    integer not null default 2025,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table passport_profiles enable row level security;
create policy "Profils lisibles" on passport_profiles for select using (true);
create policy "Profils créables" on passport_profiles for insert with check (true);
create policy "Profils modifiables" on passport_profiles for update using (true);

-- ─── Scans QR ────────────────────────────────────────────────────────────────
create table if not exists passport_scans (
  id            uuid primary key default uuid_generate_v4(),
  session_id    text not null references passport_profiles(session_id) on delete cascade,
  stand_id      uuid not null references festival_stands(id),
  points_earned integer not null,
  scanned_at    timestamptz default now(),
  unique(session_id, stand_id)
);

alter table passport_scans enable row level security;
create policy "Scans lisibles" on passport_scans for select using (true);
create policy "Scans créables" on passport_scans for insert with check (true);

-- ─── Défis mensuels ──────────────────────────────────────────────────────────
create table if not exists monthly_challenges (
  id             uuid primary key default uuid_generate_v4(),
  association_id uuid references associations(id),
  title          text not null,
  description    text not null,
  sport          text not null,
  instructions   text,
  month          integer not null check (month between 1 and 12),
  year           integer not null,
  points         integer not null default 50,
  active         boolean default true,
  created_at     timestamptz default now()
);

alter table monthly_challenges enable row level security;
create policy "Défis lisibles" on monthly_challenges for select using (true);
create policy "Admins gèrent les défis" on monthly_challenges for all using (auth.role() = 'authenticated');

-- ─── Participations aux défis ────────────────────────────────────────────────
create table if not exists challenge_participations (
  id              uuid primary key default uuid_generate_v4(),
  session_id      text not null references passport_profiles(session_id) on delete cascade,
  challenge_id    uuid not null references monthly_challenges(id),
  proof_text      text,
  points_earned   integer not null,
  validated       boolean default false,
  participated_at timestamptz default now(),
  unique(session_id, challenge_id)
);

alter table challenge_participations enable row level security;
create policy "Participations lisibles" on challenge_participations for select using (true);
create policy "Participations créables" on challenge_participations for insert with check (true);

-- ─── Données de démo ─────────────────────────────────────────────────────────

insert into festival_stands (name, sport, category, description, points, location, qr_code, festival_year) values
  ('Boccia',          'Boccia',                 'handisport', 'Sport de précision paralympique — accessible à tous',       10, 'Zone A',         'boccia-2025',          2025),
  ('Basket Fauteuil', 'Basket-ball en fauteuil','handisport', 'Démonstration et initiation par des champions',             10, 'Terrain central','basket-fauteuil-2025', 2025),
  ('Goalball',        'Goalball',               'handisport', 'Sport paralympique pour déficients visuels',                10, 'Zone C',         'goalball-2025',         2025),
  ('Cécifoot',        'Cécifoot',               'equipe',     'Football pour déficients visuels — yeux bandés !',          10, 'Terrain B',      'cecifoot-2025',         2025),
  ('Yoga Inclusif',   'Yoga adapté',            'bienetre',   'Séance accessible à tous les corps et capacités',           10, 'Zone Zen',       'yoga-2025',             2025),
  ('Tennis Fauteuil', 'Tennis en fauteuil',     'handisport', 'Initiation guidée au tennis fauteuil',                     10, 'Court 1',        'tennis-fauteuil-2025',  2025),
  ('Natation Adaptée','Natation',               'handisport', 'Cours en piscine accessible à tous les handicaps',          10, 'Piscine',        'natation-2025',         2025),
  ('Danse Inclusive', 'Danse',                  'bienetre',   'Atelier de danse pour tous les corps',                     10, 'Scène B',        'danse-2025',            2025),
  ('Rugby Fauteuil',  'Rugby en fauteuil',      'equipe',     'Découverte du rugby fauteuil — sport de contact adapté',   10, 'Terrain C',      'rugby-fauteuil-2025',   2025),
  ('Tir à l''arc',    'Tir à l''arc adapté',    'handisport', 'Précision et concentration — adapté à tous niveaux',       10, 'Zone D',         'tir-arc-2025',          2025)
on conflict (qr_code) do nothing;

insert into monthly_challenges (title, description, sport, instructions, month, year, points) values
  ('Défi Boccia — Avril',
   'Participe à une séance de boccia dans un club ou avec des amis !',
   'Boccia',
   'Entraîne-toi 30 minutes, prends une photo et décris ton expérience ci-dessous.',
   4, 2025, 50),
  ('Défi Yoga — Mai',
   'Pratique 3 séances de yoga ou de stretching adapté dans le mois.',
   'Yoga',
   'Note tes 3 séances (date, durée, ressenti) et partage-les avec nous.',
   5, 2025, 50),
  ('Défi Basket Fauteuil — Juin',
   'Teste le basket en fauteuil dans un club partenaire avant le festival.',
   'Basket fauteuil',
   'Contacte une de nos associations partenaires pour une séance découverte gratuite.',
   6, 2025, 50)
on conflict do nothing;
