import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
  );
}
if (!supabaseKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types dérivés du schéma ──────────────────────────────────────────────────

export type Association = {
  id: string;
  name: string;
  sport: string;
  description: string;
  contact_email: string;
  tags: string[];
  validated: boolean;
  created_at: string;
};

export type ProgrammeSlot = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  tag: string;
  festival_year: number;
  created_at: string;
};

export type Don = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  montant: number;
  recu_fiscal: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type QuizResult = {
  id: string;
  session_id: string;
  answers: Record<string, number>;
  score: number;
  created_at: string;
};
