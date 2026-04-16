-- ============================================================
-- Solimouv' PWA — Schéma Supabase
-- Up Sport! Paris
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Associations partenaires ────────────────────────────────────────────────
create table if not exists associations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  sport       text not null,
  description text,
  contact_email text,
  tags        text[] default '{}',
  validated   boolean default false,
  created_at  timestamptz default now()
);

alter table associations enable row level security;

-- Lecture publique des associations validées
create policy "Associations publiques lisibles"
  on associations for select
  using (validated = true);

-- Écriture admin uniquement
create policy "Admins peuvent tout faire"
  on associations for all
  using (auth.role() = 'authenticated');

-- ─── Programme ───────────────────────────────────────────────────────────────
create table if not exists programme_slots (
  id            uuid primary key default uuid_generate_v4(),
  time          text not null,           -- ex: "09:30"
  title         text not null,
  description   text,
  location      text,
  tag           text,
  festival_year integer not null default date_part('year', now())::integer,
  created_at    timestamptz default now()
);

alter table programme_slots enable row level security;

create policy "Programme lisible publiquement"
  on programme_slots for select
  using (true);

create policy "Admins gèrent le programme"
  on programme_slots for all
  using (auth.role() = 'authenticated');

-- ─── Dons ────────────────────────────────────────────────────────────────────
create table if not exists dons (
  id          uuid primary key default uuid_generate_v4(),
  prenom      text not null,
  nom         text not null,
  email       text not null,
  montant     integer not null check (montant >= 1),
  recu_fiscal boolean default false,
  created_at  timestamptz default now()
);

alter table dons enable row level security;

-- Seuls les admins voient les dons
create policy "Admins voient les dons"
  on dons for select
  using (auth.role() = 'authenticated');

-- N'importe qui peut insérer un don
create policy "Don public"
  on dons for insert
  with check (true);

-- ─── Messages de contact ─────────────────────────────────────────────────────
create table if not exists contact_messages (
  id       uuid primary key default uuid_generate_v4(),
  name     text not null,
  email    text not null,
  subject  text,
  message  text not null,
  read     boolean default false,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Admins lisent les messages"
  on contact_messages for select
  using (auth.role() = 'authenticated');

create policy "Envoi message public"
  on contact_messages for insert
  with check (true);

-- ─── Résultats du quiz ───────────────────────────────────────────────────────
create table if not exists quiz_results (
  id         uuid primary key default uuid_generate_v4(),
  session_id text not null,
  answers    jsonb not null default '{}',
  score      integer not null default 0,
  created_at timestamptz default now()
);

alter table quiz_results enable row level security;

create policy "Quiz résultats publics en lecture"
  on quiz_results for select
  using (true);

create policy "Quiz résultats publics en écriture"
  on quiz_results for insert
  with check (true);

-- ─── Données de démo ─────────────────────────────────────────────────────────
insert into associations (name, sport, description, contact_email, tags, validated) values
  ('Paris Basket Fauteuil', 'Basket-ball en fauteuil', 'Club parisien de basket en fauteuil roulant.', 'contact@pbf.fr', '{"Fauteuil","Compétition"}', true),
  ('Goalball Île-de-France', 'Goalball', 'Association dédiée au goalball paralympique.', 'info@goalball-idf.fr', '{"Déficience visuelle","Paralympique"}', true),
  ('HandiNatation Paris', 'Natation adaptée', 'Cours dans 5 piscines parisiennes.', 'nager@handi-natation.fr', '{"Natation","Tous handicaps"}', true)
on conflict do nothing;

insert into programme_slots (time, title, description, location, tag, festival_year) values
  ('09:00', 'Ouverture du festival', 'Accueil et mot d''ouverture.', 'Scène principale', 'Cérémonie', 2025),
  ('09:30', 'Initiation au boccia', 'Sport de précision adapté.', 'Zone A', 'Sport adapté', 2025),
  ('10:00', 'Démo : Basket fauteuil', 'Démonstration et initiation.', 'Terrain central', 'Démonstration', 2025)
on conflict do nothing;
