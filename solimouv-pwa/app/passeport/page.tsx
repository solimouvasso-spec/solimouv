"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, PassportProfile, PassportScan } from "@/lib/supabase";
import PageHero from "@/components/PageHero";

const BADGES = [
  {
    id: "first-scan",
    name: "Explorateur",
    description: "Premier stand scanné !",
    icon: "🔍",
    gradient: "from-teal/30 to-teal/10",
    border: "border-teal/50",
    glow: "0 0 20px rgba(0,201,167,.4)",
    check: (s: PassportScan[]) => s.length >= 1,
  },
  {
    id: "handisport",
    name: "Découverte Handisport",
    description: "Tu as testé un sport handisport.",
    icon: "♿",
    gradient: "from-accent/30 to-accent/10",
    border: "border-accent/50",
    glow: "0 0 20px rgba(230,57,70,.4)",
    check: (s: PassportScan[]) => s.some((x) => x.festival_stands?.category === "handisport"),
  },
  {
    id: "equipe",
    name: "Esprit d'Équipe",
    description: "Tu as participé à un sport collectif.",
    icon: "🤝",
    gradient: "from-teal/30 to-teal/10",
    border: "border-teal/50",
    glow: "0 0 20px rgba(0,201,167,.4)",
    check: (s: PassportScan[]) => s.some((x) => x.festival_stands?.category === "equipe"),
  },
  {
    id: "bienetre",
    name: "Zen & Santé Mentale",
    description: "Activité bien-être explorée.",
    icon: "🧘",
    gradient: "from-purple-500/30 to-purple-500/10",
    border: "border-purple-400/50",
    glow: "0 0 20px rgba(168,85,247,.4)",
    check: (s: PassportScan[]) => s.some((x) => x.festival_stands?.category === "bienetre"),
  },
  {
    id: "soliathlete",
    name: "Soli'Athlète",
    description: "5 stands validés ! Réclame ton lot à l'accueil.",
    icon: "🏆",
    gradient: "from-yellow-400/30 to-yellow-400/10",
    border: "border-yellow-400/50",
    glow: "0 0 30px rgba(250,204,21,.5)",
    check: (s: PassportScan[]) => s.length >= 5,
  },
];

const TOTAL_STANDS = 10;
const STANDS_FOR_REWARD = 5;

function genSession() {
  return `sol_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export default function PasseportPage() {
  const [step, setStep] = useState<"loading" | "register" | "passport">(() =>
    typeof window === "undefined"
      ? "loading"
      : localStorage.getItem("solimouv_session_id")
        ? "loading"
        : "register"
  );
  const [profile, setProfile] = useState<PassportProfile | null>(null);
  const [scans, setScans] = useState<PassportScan[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPassport(sid: string) {
    const { data: prof } = await supabase
      .from("passport_profiles").select("*").eq("session_id", sid).single();
    if (!prof) { setStep("register"); return; }
    const { data: sc } = await supabase
      .from("passport_scans").select("*, festival_stands(*)")
      .eq("session_id", sid).order("scanned_at", { ascending: false });
    setProfile(prof);
    setScans((sc as PassportScan[]) || []);
    setStep("passport");
  }

  useEffect(() => {
    const sid = localStorage.getItem("solimouv_session_id");
    if (!sid) return;
    const timeoutId = window.setTimeout(() => {
      void loadPassport(sid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setError(null);
    const sid = genSession();
    const { data, error: err } = await supabase
      .from("passport_profiles")
      .insert({ session_id: sid, display_name: name.trim(), email: email.trim() || null })
      .select().single();
    if (err || !data) { setError("Erreur. Réessaie."); setSaving(false); return; }
    localStorage.setItem("solimouv_session_id", sid);
    setProfile(data); setScans([]); setStep("passport"); setSaving(false);
  }

  const earned = BADGES.filter((b) => b.check(scans));
  const pct = Math.min((scans.length / TOTAL_STANDS) * 100, 100);
  const champion = scans.length >= STANDS_FOR_REWARD;
  const remaining = Math.max(STANDS_FOR_REWARD - scans.length, 0);

  /* ── Loading ── */
  if (step === "loading") return (
    <div className="flex items-center justify-center min-h-[70vh]" role="status">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-teal/20 border-t-teal rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-accent rounded-full animate-spin animate-shimmer" style={{ animationDelay: "150ms" }} />
      </div>
    </div>
  );

  /* ── Inscription ── */
  if (step === "register") return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <PageHero
          eyebrow="Soli&apos;Passeport"
          title="Ton parcours commence ici"
          description="Le flux est simple: tu crees ton passeport, tu scannes les stands, puis tu suis tes points et tes badges dans une seule interface."
          actions={[
            { href: "/programme", label: "Voir le programme", variant: "secondary" },
          ]}
        />

        <div className="journey-grid stagger-list">
          {[
            ["1", "Je cree", "Je choisis un prenom ou pseudo pour lancer mon pass."],
            ["2", "Je scanne", "Je valide les stands pendant le festival."],
            ["3", "Je suis", "Je retrouve mes points, badges et prochaines etapes."],
          ].map(([index, title, copy], idx) => (
            <div
              key={title}
              className="journey-step"
              data-reveal
              style={{ ["--stagger-index" as string]: idx }}
            >
              <span className="journey-step__index">{index}</span>
              <h2 className="journey-step__title">{title}</h2>
              <p className="journey-step__copy">{copy}</p>
            </div>
          ))}
        </div>

        <div className="app-card app-card--soft" data-reveal>
          <div className="app-card__content">
            <div className="flex justify-center gap-3 mb-8" aria-hidden="true">
              {BADGES.map((b, i) => (
                <div
                  key={b.id}
                  className="w-11 h-11 rounded-xl glass border border-gray-700/40 flex items-center justify-center opacity-30 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-xl grayscale">🔒</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleRegister} className="app-form" noValidate>
              <div className="app-form__grid">
                <div className="app-field">
                  <label htmlFor="reg-name">
                    Ton prénom / pseudo <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Marie"
                    autoComplete="given-name"
                    className="app-input"
                  />
                </div>
                <div className="app-field">
                  <label htmlFor="reg-email">
                    Email <span className="text-white/45 font-normal text-xs">(optionnel)</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pour recevoir tes résultats"
                    autoComplete="email"
                    className="app-input"
                  />
                </div>
              </div>
            {error && <p role="alert" className="text-accent text-sm">{error}</p>}
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="app-button app-button--primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Création..." : "Créer mon passeport"}
              </button>
              <p className="text-white/55 text-xs text-center m-0">
                Aucun mot de passe requis · Sauvegardé sur cet appareil
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Passeport ── */
  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
      <PageHero
        eyebrow="Passeport actif"
        title="Ton tableau de bord festival"
        description="Tu retrouves ici tes points, tes badges, ton avancement et les raccourcis utiles pour continuer ton parcours sans te perdre."
        actions={[
          { href: "/scan", label: "Scanner un stand" },
          { href: "/defis", label: "Voir les défis", variant: "secondary" },
        ]}
      />

      {/* ── Carte principale ── */}
      <header className="relative overflow-hidden rounded-3xl p-6 sm:p-8 animate-fade-up"
        style={{
          background: "linear-gradient(135deg, rgba(26,47,69,.9) 0%, rgba(7,17,26,.95) 100%)",
          border: "1px solid rgba(0,201,167,.2)",
          boxShadow: "0 0 60px rgba(0,201,167,.08), inset 0 1px 0 rgba(255,255,255,.04)",
        }}
        aria-label="Ton Soli'Passeport"
      >
        {/* Orbe déco */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, #00C9A7, transparent)" }}
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative">
          <div>
            <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-1">
              Soli&apos;Passeport · Festival 2025
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {profile?.display_name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-5xl font-extrabold text-gradient-teal leading-none" aria-label={`${profile?.total_points} points`}>
              {profile?.total_points}
            </p>
            <p className="text-gray-600 text-xs mt-1">points totaux</p>
          </div>
        </div>

        {/* Points breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-dark rounded-2xl p-3.5 text-center">
            <p className="text-2xl font-extrabold text-gradient-teal">{profile?.festival_points}</p>
            <p className="text-gray-600 text-xs mt-0.5">Festival</p>
          </div>
          <div className="glass-dark rounded-2xl p-3.5 text-center">
            <p className="text-2xl font-extrabold text-gradient-accent">{profile?.challenge_points}</p>
            <p className="text-gray-600 text-xs mt-0.5">Défis</p>
          </div>
        </div>

        {/* Barre Soli'Athlète */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{scans.length} / {TOTAL_STANDS} stands validés</span>
            <span className={champion ? "text-yellow-400 font-semibold" : ""}>
              {champion ? "🏆 Soli'Athlète !" : `Encore ${remaining} pour le lot`}
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: "rgba(7,17,26,.8)" }}
            role="progressbar"
            aria-valuenow={scans.length}
            aria-valuemin={0}
            aria-valuemax={TOTAL_STANDS}
            aria-label={`${scans.length} sur ${TOTAL_STANDS} stands`}
          >
            <div
              className="h-full rounded-full progress-bar-animated"
              style={{
                width: `${pct}%`,
                background: champion
                  ? "linear-gradient(90deg, #00C9A7, #F59E0B, #FCD34D)"
                  : "linear-gradient(90deg, #00C9A7, #00f0cc)",
                boxShadow: champion ? "0 0 12px rgba(245,158,11,.5)" : "0 0 8px rgba(0,201,167,.4)",
              }}
            />
          </div>

          {/* Milestones */}
          <div className="flex justify-between mt-1 px-0.5">
            {[2, 4, 5, 7, 10].map((n) => (
              <div key={n} className="text-center">
                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${scans.length >= n ? "bg-teal" : "bg-gray-700"}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 relative">
          <Link
            href="/scan"
            className="flex-1 text-center py-3.5 rounded-full font-bold text-white transition-all hover:scale-[1.02] text-sm"
            style={{ background: "linear-gradient(135deg, #E63946, #c4232f)" }}
          >
            📷 Scanner un stand
          </Link>
          <Link
            href="/defis"
            className="flex-1 text-center py-3.5 rounded-full font-bold text-teal border border-teal/30 hover:bg-teal/10 transition-all text-sm"
          >
            🎯 Défis mensuels
          </Link>
          <Link
            href="/classement"
            className="flex-1 text-center py-3.5 rounded-full font-bold text-gray-400 border border-gray-700/50 hover:bg-white/5 transition-all text-sm"
          >
            🏅 Classement
          </Link>
        </div>
      </header>

      {/* ── Badges ── */}
      <section aria-labelledby="badges-heading" className="animate-fade-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h2 id="badges-heading" className="text-xl font-extrabold text-white">
            Badges
          </h2>
          <span className="glass rounded-full px-3 py-1 text-teal text-xs font-semibold">
            {earned.length} / {BADGES.length}
          </span>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
          {BADGES.map((badge, i) => {
            const ok = badge.check(scans);
            return (
              <li
                key={badge.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  ok
                    ? `bg-gradient-to-br ${badge.gradient} ${badge.border} animate-badge-pop`
                    : "glass border-gray-800/50 opacity-40"
                }`}
                style={ok ? { boxShadow: badge.glow, animationDelay: `${i * 60}ms` } : {}}
                aria-label={`Badge ${badge.name} : ${ok ? "débloqué" : "verrouillé"}`}
              >
                {ok && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal" aria-label="Débloqué" />
                )}
                <span className="text-3xl block mb-2" role="img" aria-hidden="true">
                  {ok ? badge.icon : "🔒"}
                </span>
                <p className="font-bold text-white text-sm leading-tight mb-0.5">
                  {ok ? badge.name : "???"}
                </p>
                <p className="text-gray-400 text-xs leading-snug">{badge.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Historique ── */}
      <section aria-labelledby="history-heading" className="animate-fade-up delay-200">
        <h2 id="history-heading" className="text-xl font-extrabold text-white mb-4">
          Activités validées
          {scans.length > 0 && (
            <span className="ml-2 text-gray-600 font-normal text-sm">({scans.length})</span>
          )}
        </h2>

        {scans.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border-dashed border-2 border-teal/10">
            <span className="text-5xl block mb-4 animate-float" role="img">📱</span>
            <p className="text-gray-400 font-semibold mb-2">Aucun stand scanné</p>
            <p className="text-gray-600 text-sm mb-6">
              Scanne les QR codes aux stands du festival pour démarrer l&apos;aventure !
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center px-6 py-2.5 rounded-full font-bold text-navy text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
            >
              Scanner maintenant →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {scans.map((scan, i) => (
              <li
                key={scan.id}
                className="group flex items-center justify-between glass rounded-2xl px-4 py-3.5 border border-teal/10 hover:border-teal/25 transition-all animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal/15 border border-teal/20 flex items-center justify-center shrink-0 text-sm" aria-hidden="true">
                    ✅
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{scan.festival_stands?.name ?? "Stand"}</p>
                    <p className="text-gray-600 text-xs">{scan.festival_stands?.sport} · {scan.festival_stands?.location}</p>
                  </div>
                </div>
                <span className="text-teal font-extrabold text-sm" aria-label={`${scan.points_earned} points`}>
                  +{scan.points_earned} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reset */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            if (window.confirm("Réinitialiser ton passeport ? Tous tes points seront perdus.")) {
              localStorage.removeItem("solimouv_session_id");
              setStep("register"); setProfile(null); setScans([]);
            }
          }}
          className="text-gray-700 text-xs hover:text-gray-500 transition-colors"
        >
          Changer d&apos;appareil / réinitialiser
        </button>
      </div>
      </div>
    </div>
  );
}
