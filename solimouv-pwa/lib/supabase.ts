import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types existants ──────────────────────────────────────────────────────────

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

// ─── Types Soli'Passeport ─────────────────────────────────────────────────────

export type FestivalStand = {
  id: string;
  name: string;
  sport: string;
  category: "handisport" | "equipe" | "bienetre" | "culturel";
  description: string | null;
  points: number;
  location: string | null;
  qr_code: string;
  active: boolean;
  festival_year: number;
};

export type PassportProfile = {
  id: string;
  session_id: string;
  display_name: string;
  email: string | null;
  total_points: number;
  festival_points: number;
  challenge_points: number;
  festival_year: number;
  created_at: string;
  updated_at: string;
};

export type PassportScan = {
  id: string;
  session_id: string;
  stand_id: string;
  points_earned: number;
  scanned_at: string;
  festival_stands?: FestivalStand;
};

export type MonthlyChallenge = {
  id: string;
  association_id: string | null;
  title: string;
  description: string;
  sport: string;
  instructions: string | null;
  month: number;
  year: number;
  points: number;
  active: boolean;
  created_at: string;
};

export type ChallengeParticipation = {
  id: string;
  session_id: string;
  challenge_id: string;
  proof_text: string | null;
  points_earned: number;
  validated: boolean;
  participated_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Incrémenter les points d'un profil passeport (read-then-write safe pour hackathon) */
export async function addPassportPoints(
  sessionId: string,
  festivalPoints: number,
  challengePoints: number
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("passport_profiles")
    .select("festival_points, challenge_points, total_points")
    .eq("session_id", sessionId)
    .single();

  if (!profile) return false;

  const { error } = await supabase
    .from("passport_profiles")
    .update({
      festival_points: profile.festival_points + festivalPoints,
      challenge_points: profile.challenge_points + challengePoints,
      total_points: profile.total_points + festivalPoints + challengePoints,
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  return !error;
}
