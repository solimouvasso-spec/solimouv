"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, PassportProfile, PassportScan } from "@/lib/supabase";

// ─── Système de badges ────────────────────────────────────────────────────────
const BADGES = [
  {
    id: "first-scan",
    name: "Explorateur",
    description: "Premier stand scanné !",
    icon: "🔍",
    colorUnlocked: "border-teal bg-teal/10 text-teal",
    check: (scans: PassportScan[]) => scans.length >= 1,
  },
  {
    id: "handisport",
    name: "Découverte Handisport",
    description: "Tu as testé un sport handisport.",
    icon: "♿",
    colorUnlocked: "border-accent bg-accent/10 text-accent",
    check: (scans: PassportScan[]) =>
      scans.some((s) => s.festival_stands?.category === "handisport"),
  },
  {
    id: "equipe",
    name: "Esprit d'Équipe",
    description: "Tu as participé à un sport collectif.",
    icon: "🤝",
    colorUnlocked: "border-teal bg-teal/10 text-teal",
    check: (scans: PassportScan[]) =>
      scans.some((s) => s.festival_stands?.category === "equipe"),
  },
  {
    id: "bienetre",
    name: "Zen & Santé Mentale",
    description: "Activité bien-être explorée.",
    icon: "🧘",
    colorUnlocked: "border-purple-400 bg-purple-400/10 text-purple-400",
    check: (scans: PassportScan[]) =>
      scans.some((s) => s.festival_stands?.category === "bienetre"),
  },
  {
    id: "soliathlete",
    name: "Soli'Athlète",
    description: "5 stands validés ! Réclame ton lot à l'accueil.",
    icon: "🏆",
    colorUnlocked: "border-yellow-400 bg-yellow-400/10 text-yellow-400",
    check: (scans: PassportScan[]) => scans.length >= 5,
  },
];

const TOTAL_STANDS = 10;
const STANDS_FOR_REWARD = 5;

function generateSessionId(): string {
  return `sol_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function PasseportPage() {
  const [step, setStep] = useState<"loading" | "register" | "passport">("loading");
  const [profile, setProfile] = useState<PassportProfile | null>(null);
  const [scans, setScans] = useState<PassportScan[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("solimouv_session_id");
    if (!sessionId) {
      setStep("register");
      return;
    }
    loadProfile(sessionId);
  }, []);

  async function loadProfile(sessionId: string) {
    const { data: prof } = await supabase
      .from("passport_profiles")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (!prof) {
      setStep("register");
      return;
    }

    const { data: scanData } = await supabase
      .from("passport_scans")
      .select("*, festival_stands(*)")
      .eq("session_id", sessionId)
      .order("scanned_at", { ascending: false });

    setProfile(prof);
    setScans((scanData as PassportScan[]) || []);
    setStep("passport");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    setRegError(null);

    const sessionId = generateSessionId();
    const { data, error } = await supabase
      .from("passport_profiles")
      .insert({
        session_id: sessionId,
        display_name: displayName.trim(),
        email: email.trim() || null,
      })
      .select()
      .single();

    if (error || !data) {
      setRegError("Erreur lors de la création du passeport. Réessaie.");
      setSaving(false);
      return;
    }

    localStorage.setItem("solimouv_session_id", sessionId);
    setProfile(data);
    setScans([]);
    setStep("passport");
    setSaving(false);
  }

  const earnedBadges = BADGES.filter((b) => b.check(scans));
  const scanCount = scans.length;
  const progress = Math.min((scanCount / TOTAL_STANDS) * 100, 100);
  const soliAthleteUnlocked = scanCount >= STANDS_FOR_REWARD;
  const remainingForReward = Math.max(STANDS_FOR_REWARD - scanCount, 0);

  // ── État chargement ──
  if (step === "loading") {
    return (
      <div
        className="flex items-center justify-center min-h-[70vh]"
        aria-label="Chargement du passeport"
        role="status"
      >
        <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  // ── Inscription ──
  if (step === "register") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-10">
          <span className="text-7xl mb-6 block" role="img" aria-label="Passeport">
            🎟
          </span>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Soli&apos;Passeport
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Crée ton passeport numérique, scanne les stands du festival et cumule
            des points pour gagner des récompenses !
          </p>
        </div>

        {/* Badges preview */}
        <ul
          className="grid grid-cols-5 gap-2 mb-8"
          role="list"
          aria-label="Badges à débloquer"
        >
          {BADGES.map((b) => (
            <li
              key={b.id}
              className="aspect-square rounded-xl bg-navy-light border border-gray-700 flex items-center justify-center opacity-40"
              title={b.name}
            >
              <span className="text-2xl" role="img" aria-label={b.name}>
                🔒
              </span>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleRegister}
          className="space-y-4 bg-navy-light rounded-2xl p-6 border border-teal/20"
          aria-label="Formulaire de création du passeport"
          noValidate
        >
          <div>
            <label
              htmlFor="reg-name"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Ton prénom / pseudo{" "}
              <span aria-hidden="true" className="text-accent">
                *
              </span>
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: Marie"
              autoComplete="given-name"
              aria-required="true"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="reg-email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email{" "}
              <span className="text-gray-500 text-xs">
                (optionnel — pour recevoir tes résultats de fin d&apos;année)
              </span>
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@example.com"
              autoComplete="email"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            />
          </div>
          {regError && (
            <p role="alert" className="text-accent text-sm">
              {regError}
            </p>
          )}
          <button
            type="submit"
            disabled={saving || !displayName.trim()}
            className="w-full py-4 bg-teal text-navy font-bold text-lg rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Créer mon Soli'Passeport"
          >
            {saving ? "Création..." : "Créer mon passeport 🎟"}
          </button>
          <p className="text-gray-600 text-xs text-center">
            Aucun mot de passe requis. Ton passeport est sauvegardé sur cet
            appareil.
          </p>
        </form>
      </div>
    );
  }

  // ── Passeport ──
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Card passeport */}
      <header
        className="bg-navy-light rounded-2xl p-6 sm:p-8 border border-teal/20 mb-6"
        aria-label="Ton Soli'Passeport"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-1">
              Soli&apos;Passeport · 2025
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {profile?.display_name}
            </h1>
          </div>
          <div className="text-right">
            <p
              className="text-4xl font-extrabold text-teal"
              aria-label={`${profile?.total_points} points`}
            >
              {profile?.total_points}
            </p>
            <p className="text-gray-500 text-xs">points totaux</p>
          </div>
        </div>

        {/* Jauge Soli'Athlète */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>
              {scanCount}/{TOTAL_STANDS} stands validés
            </span>
            <span>
              {soliAthleteUnlocked
                ? "🏆 Soli'Athlète débloqué !"
                : `Encore ${remainingForReward} pour le lot`}
            </span>
          </div>
          <div
            className="h-3 bg-navy-dark rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={scanCount}
            aria-valuemin={0}
            aria-valuemax={TOTAL_STANDS}
            aria-label={`Progression : ${scanCount} sur ${TOTAL_STANDS} stands`}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: soliAthleteUnlocked
                  ? "linear-gradient(90deg, #00C9A7, #F1C40F)"
                  : "linear-gradient(90deg, #00C9A7, #009980)",
              }}
            />
          </div>
        </div>

        {/* Points détail */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-navy-dark rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-teal">
              {profile?.festival_points}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">Points festival</p>
          </div>
          <div className="bg-navy-dark rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-accent">
              {profile?.challenge_points}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">Points défis</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/scan"
            className="flex-1 text-center py-3 bg-accent text-white font-bold rounded-full hover:bg-accent/90 transition-colors text-sm"
            aria-label="Scanner un QR code de stand"
          >
            📷 Scanner un stand
          </Link>
          <Link
            href="/defis"
            className="flex-1 text-center py-3 border border-teal text-teal font-bold rounded-full hover:bg-teal/10 transition-colors text-sm"
            aria-label="Voir les défis mensuels"
          >
            🎯 Défis mensuels
          </Link>
          <Link
            href="/classement"
            className="flex-1 text-center py-3 border border-gray-600 text-gray-400 font-bold rounded-full hover:bg-white/5 transition-colors text-sm"
            aria-label="Voir le classement"
          >
            🏅 Classement
          </Link>
        </div>
      </header>

      {/* Badges */}
      <section aria-labelledby="badges-heading" className="mb-6">
        <h2 id="badges-heading" className="text-xl font-bold text-white mb-4">
          Badges{" "}
          <span className="text-gray-500 font-normal text-sm">
            ({earnedBadges.length}/{BADGES.length})
          </span>
        </h2>
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          role="list"
          aria-label="Tes badges"
        >
          {BADGES.map((badge) => {
            const earned = badge.check(scans);
            return (
              <li
                key={badge.id}
                className={`rounded-xl p-4 border-2 transition-all ${
                  earned
                    ? badge.colorUnlocked
                    : "border-gray-700/50 bg-navy-light opacity-40"
                }`}
                aria-label={`Badge ${badge.name} : ${earned ? "débloqué" : "verrouillé"}`}
              >
                <span
                  className="text-3xl block mb-2"
                  role="img"
                  aria-hidden="true"
                >
                  {earned ? badge.icon : "🔒"}
                </span>
                <p className="font-semibold text-sm mb-1">
                  {earned ? badge.name : "???"}
                </p>
                <p className="text-xs leading-tight opacity-80">
                  {badge.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Historique des scans */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-xl font-bold text-white mb-4">
          Activités validées
        </h2>
        {scans.length === 0 ? (
          <div className="text-center py-12 bg-navy-light rounded-2xl border border-teal/10">
            <span className="text-5xl block mb-3" role="img" aria-label="Aucun scan">
              📱
            </span>
            <p className="text-gray-400 mb-2">Aucun stand scanné pour l&apos;instant</p>
            <p className="text-gray-600 text-sm">
              Scanne les QR codes aux stands du festival pour démarrer l&apos;aventure !
            </p>
            <Link
              href="/scan"
              className="inline-block mt-5 px-6 py-2 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors text-sm"
              aria-label="Scanner mon premier stand"
            >
              Scanner maintenant
            </Link>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {scans.map((scan) => (
              <li
                key={scan.id}
                className="flex items-center justify-between bg-navy-light rounded-xl px-4 py-3 border border-teal/10"
              >
                <div>
                  <p className="text-white text-sm font-semibold">
                    {scan.festival_stands?.name ?? "Stand"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {scan.festival_stands?.sport} ·{" "}
                    {scan.festival_stands?.location}
                  </p>
                </div>
                <span
                  className="text-teal font-bold text-sm"
                  aria-label={`${scan.points_earned} points gagnés`}
                >
                  +{scan.points_earned} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reset */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            if (
              window.confirm(
                "Réinitialiser ton passeport ? Tous tes points et badges seront perdus."
              )
            ) {
              localStorage.removeItem("solimouv_session_id");
              setStep("register");
              setProfile(null);
              setScans([]);
            }
          }}
          className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
          aria-label="Réinitialiser mon passeport"
        >
          Changer d&apos;appareil / réinitialiser
        </button>
      </div>
    </div>
  );
}
