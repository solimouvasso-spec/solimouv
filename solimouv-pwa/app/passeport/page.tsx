"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  supabase,
  ChallengeParticipation,
  PassportProfile,
  PassportScan,
} from "@/lib/supabase";

const PASSPORT_PHOTO =
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80";
const PASSPORT_PHOTO_ALT =
  "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=80";

const BADGES = [
  {
    id: "first-scan",
    name: "Explorateur",
    description: "Premier stand scanne !",
    icon: "✺",
    color: "#9ed2ff",
    check: (s: PassportScan[]) => s.length >= 1,
  },
  {
    id: "handisport",
    name: "Decouverte",
    description: "Tu as teste un sport handisport.",
    icon: "◌",
    color: "#d7a5f1",
    check: (s: PassportScan[]) =>
      s.some((x) => x.festival_stands?.category === "handisport"),
  },
  {
    id: "soliathlete",
    name: "Soli'Athlete",
    description: "5 stands valides.",
    icon: "❂",
    color: "#f8f35d",
    check: (s: PassportScan[]) => s.length >= 5,
  },
];

const AVATARS = [
  { id: "standing", icon: "🧍", accent: "#e58adb" },
  { id: "wheel", icon: "♿", accent: "#6551ff" },
  { id: "runner", icon: "🏃", accent: "#194f37" },
  { id: "duo", icon: "🤝", accent: "#f8f35d" },
];

const GOALS = [
  "Scanner des stands et debloquer des badges.",
  "Participer a des activites sans pression.",
  "Construire ton parcours pendant le festival.",
];

const TOTAL_STANDS = 10;

function genSession() {
  return `sol_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function avatarStorageKey(sessionId: string) {
  return `solimouv_avatar_${sessionId}`;
}

function sumPoints<T extends { points_earned: number | null | undefined }>(items: T[]) {
  return items.reduce((total, item) => total + (item.points_earned ?? 0), 0);
}

function AvatarCard({
  icon,
  active,
  accent,
}: {
  icon: string;
  active?: boolean;
  accent: string;
}) {
  return (
    <div
      className={`passport-avatar-card ${active ? "is-active" : ""}`}
      style={{ ["--avatar-accent" as string]: accent }}
      aria-hidden="true"
    >
      <span>{icon}</span>
    </div>
  );
}

function DesktopAside({
  title,
  subtitle,
  bullets,
  photo,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
  photo: string;
}) {
  return (
    <aside className="passport-aside" aria-hidden="true" data-reveal>
      <div className="passport-aside__panel">
        <div className="passport-aside__copy">
          <p className="passport-aside__eyebrow">Soli&apos;Passeport</p>
          <h2 className="passport-aside__title">{title}</h2>
          <p className="passport-aside__subtitle">{subtitle}</p>

          <div className="passport-aside__bullets">
            {bullets.map((text) => (
              <div key={text} className="passport-aside__bullet">
                <span className="passport-aside__dot">✺</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="passport-aside__photo">
          <img src={photo} alt="" loading="lazy" />
        </div>
      </div>
    </aside>
  );
}

export default function PasseportPage() {
  const [step, setStep] = useState<
    "loading" | "welcome" | "identity" | "avatar" | "rules" | "passport"
  >(() => {
    if (typeof window === "undefined") {
      return "welcome";
    }

    return localStorage.getItem("solimouv_session_id") ? "loading" : "welcome";
  });
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [profile, setProfile] = useState<PassportProfile | null>(null);
  const [scans, setScans] = useState<PassportScan[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPassport(sessionId: string, avatarId?: string) {
    try {
      const { data: prof, error: profileError } = await supabase
        .from("passport_profiles")
        .select("*")
        .eq("session_id", sessionId)
        .single();

      if (profileError || !prof) {
        setProfile(null);
        setScans([]);
        return false;
      }

      const { data: sc } = await supabase
        .from("passport_scans")
        .select("*, festival_stands(*)")
        .eq("session_id", sessionId)
        .order("scanned_at", { ascending: false });

      const { data: participations } = await supabase
        .from("challenge_participations")
        .select("points_earned")
        .eq("session_id", sessionId);

      const scanRows = (sc as PassportScan[]) || [];
      const participationRows =
        (participations as Pick<ChallengeParticipation, "points_earned">[]) || [];
      const festivalPoints = sumPoints(scanRows);
      const challengePoints = sumPoints(participationRows);
      const totalPoints = festivalPoints + challengePoints;

      const normalizedProfile: PassportProfile = {
        ...prof,
        festival_points: Math.max(prof.festival_points ?? 0, festivalPoints),
        challenge_points: Math.max(prof.challenge_points ?? 0, challengePoints),
        total_points: Math.max(prof.total_points ?? 0, totalPoints),
      };

      const shouldSyncProfile =
        normalizedProfile.festival_points !== (prof.festival_points ?? 0) ||
        normalizedProfile.challenge_points !== (prof.challenge_points ?? 0) ||
        normalizedProfile.total_points !== (prof.total_points ?? 0);

      if (shouldSyncProfile) {
        void supabase
          .from("passport_profiles")
          .update({
            festival_points: normalizedProfile.festival_points,
            challenge_points: normalizedProfile.challenge_points,
            total_points: normalizedProfile.total_points,
            updated_at: new Date().toISOString(),
          })
          .eq("session_id", sessionId);
      }

      setProfile(normalizedProfile);
      setEmail(normalizedProfile.email ?? "");
      setName(normalizedProfile.display_name);
      setSelectedAvatar(
        avatarId ?? localStorage.getItem(avatarStorageKey(sessionId)) ?? AVATARS[0].id
      );
      setScans(scanRows);
      setStep("passport");
      return true;
    } catch {
      setProfile(null);
      setScans([]);
      return false;
    }
  }

  useEffect(() => {
    const sessionId = localStorage.getItem("solimouv_session_id");
    if (!sessionId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadPassport(sessionId).then((loaded) => {
        if (loaded) return;

        localStorage.removeItem("solimouv_session_id");
        setError("Impossible de retrouver ton passeport pour le moment.");
        setStep("welcome");
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function createPassport() {
    if (!name.trim() || !email.trim()) return;

    setSaving(true);
    setError(null);

    const sessionId = genSession();
    const cleanEmail = email.trim().toLowerCase();

    const { data: existing } = await supabase
      .from("passport_profiles")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      setError("Cette adresse email a deja un passeport. Utilise la connexion.");
      setSaving(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("passport_profiles")
      .insert({
        session_id: sessionId,
        display_name: name.trim(),
        email: cleanEmail,
      })
      .select()
      .single();

    if (insertError || !data) {
      setError("Impossible de creer le passeport pour le moment.");
      setSaving(false);
      return;
    }

    localStorage.setItem("solimouv_session_id", sessionId);
    localStorage.setItem(avatarStorageKey(sessionId), selectedAvatar);
    setProfile(data);
    setScans([]);
    setStep("passport");
    setSaving(false);
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSaving(true);
    setError(null);
    setStep("loading");

    const cleanEmail = email.trim().toLowerCase();
    const { data, error: loginError } = await supabase
      .from("passport_profiles")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (loginError || !data) {
      setError("Aucun passeport trouve avec cette adresse email.");
      setStep("identity");
      setSaving(false);
      return;
    }

    localStorage.setItem("solimouv_session_id", data.session_id);
    const storedAvatar =
      localStorage.getItem(avatarStorageKey(data.session_id)) ?? AVATARS[0].id;
    const loaded = await loadPassport(data.session_id, storedAvatar);

    if (!loaded) {
      localStorage.removeItem("solimouv_session_id");
      setError("Connexion reussie, mais le passeport n'a pas pu etre charge.");
      setStep("identity");
    }

    setSaving(false);
  }

  const earnedBadges = BADGES.filter((badge) => badge.check(scans));
  const selectedAvatarData =
    AVATARS.find((avatar) => avatar.id === selectedAvatar) ?? AVATARS[0];
  const progress = Math.min((scans.length / TOTAL_STANDS) * 100, 100);

  if (step === "passport" && !profile) {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="passport-onboarding">
            <div className="passport-phone-card">
              <div className="passport-sheet">
                <h1 className="passport-sheet__title">Passeport introuvable</h1>
                <p className="passport-sheet__copy">
                  La connexion a bien ete lancee, mais aucune fiche passeport n&apos;a pu etre affichee.
                </p>
                <p className="passport-error">
                  {error ?? "Reessaie avec ton email ou recree ton passeport."}
                </p>
                <button
                  type="button"
                  className="passport-primary-btn"
                  onClick={() => {
                    setStep("identity");
                    setMode("login");
                  }}
                >
                  Revenir a la connexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="passport-loader" role="status" aria-label="Chargement" />
          </div>
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="passport-layout">
            <DesktopAside
              title="Ton passeport pour bouger sans pression"
              subtitle="Un parcours simple: tu crees ton pass, tu scans, tu debloques des badges."
              bullets={[
                "Pas de mot de passe: ton email suffit.",
                "Des recompenses pendant le festival.",
                "Une experience mobile, mais lisible sur desktop.",
              ]}
              photo={PASSPORT_PHOTO}
            />

            <div className="passport-onboarding">
              <div className="passport-phone-card" data-reveal>
                <div className="passport-hero-art">
                  <div className="passport-book">
                    <div className="passport-badge passport-badge--top">🔒</div>
                    <div className="passport-badge passport-badge--mid">🔒</div>
                    <div className="passport-badge passport-badge--bottom">❂</div>
                  </div>
                </div>
                <div className="passport-sheet">
                  <h1 className="passport-sheet__title">
                    Ton passeport pour bouger sans pression
                  </h1>
                  <p className="passport-sheet__copy">
                    Essaie de nouvelles activites aujourd&apos;hui, scanne les codes,
                    et debloque des recompenses.
                  </p>
                  {error ? <p className="passport-error">{error}</p> : null}
                  <button
                    type="button"
                    className="passport-primary-btn"
                    onClick={() => {
                      setMode("signup");
                      setStep("identity");
                      setError(null);
                    }}
                  >
                    Creer mon Soli&apos;Passeport
                  </button>
                  <button
                    type="button"
                    className="passport-secondary-btn"
                    onClick={() => {
                      setMode("login");
                      setStep("identity");
                      setError(null);
                    }}
                  >
                    J&apos;ai deja un passeport
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "identity") {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="passport-layout">
            <DesktopAside
              title={mode === "signup" ? "Creation du pass" : "Connexion au pass"}
              subtitle={
                mode === "signup"
                  ? "On cree ton Soli'Passeport en 2 etapes: infos puis avatar."
                  : "Un seul champ: ton email. On retrouve ton passeport."
              }
              bullets={[
                "Zones de clic larges, app-like.",
                "Feedback visuel au clic.",
                "Coherent avec la landing.",
              ]}
              photo={PASSPORT_PHOTO_ALT}
            />

            <div className="passport-onboarding">
              <div className="passport-phone-card">
                <div className="passport-swirl-bg" aria-hidden="true" />
                <div className="passport-sheet">
                  <div className="passport-tabs">
                    <button
                      type="button"
                      className={mode === "signup" ? "is-active" : ""}
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                    >
                      Creation
                    </button>
                    <button
                      type="button"
                      className={mode === "login" ? "is-active" : ""}
                      onClick={() => {
                        setMode("login");
                        setError(null);
                      }}
                    >
                      Connexion
                    </button>
                  </div>

                  <h1 className="passport-sheet__title">
                    {mode === "signup"
                      ? "Comment on t'appelle ?"
                      : "Entre ton adresse mail"}
                  </h1>

                  {mode === "signup" ? (
                    <form
                      className="passport-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!name.trim() || !email.trim()) return;
                        setStep("avatar");
                      }}
                    >
                      <input
                        className="passport-input"
                        placeholder="Hugo le bg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <input
                        className="passport-input"
                        type="email"
                        placeholder="ton@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="passport-sheet__note">
                        Pas besoin de mot de passe. Ton email sert aussi a te reconnecter.
                      </p>
                      {error ? <p className="passport-error">{error}</p> : null}
                      <button className="passport-primary-btn" type="submit">
                        Continuer
                      </button>
                    </form>
                  ) : (
                    <form className="passport-form" onSubmit={handleEmailLogin}>
                      <input
                        className="passport-input"
                        type="email"
                        placeholder="samira@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="passport-sheet__note">
                        Tu mets ton adresse mail et tu retrouves ton passeport.
                      </p>
                      {error ? <p className="passport-error">{error}</p> : null}
                      <button
                        className="passport-primary-btn"
                        type="submit"
                        disabled={saving || !email.trim()}
                      >
                        {saving ? "Connexion..." : "Me connecter"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "avatar") {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="passport-layout">
            <DesktopAside
              title="Choisis ton avatar"
              subtitle="Un repere visuel dans ton passeport. Tu peux changer plus tard."
              bullets={[
                "Lisible sur grand ecran.",
                "Cartes et ombres soft.",
                "Animations legeres.",
              ]}
              photo={PASSPORT_PHOTO}
            />

            <div className="passport-onboarding">
              <div className="passport-phone-card">
                <div className="passport-swirl-bg" aria-hidden="true" />
                <div className="passport-sheet">
                  <h1 className="passport-sheet__title">Choisi ton avatar</h1>
                  <div className="passport-avatar-grid">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        className="passport-avatar-btn"
                        onClick={() => setSelectedAvatar(avatar.id)}
                      >
                        <AvatarCard
                          icon={avatar.icon}
                          accent={avatar.accent}
                          active={selectedAvatar === avatar.id}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="passport-primary-btn"
                    onClick={() => setStep("rules")}
                  >
                    C&apos;est parti !
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "rules") {
    return (
      <div className="app-page">
        <div className="app-page__container">
          <div className="passport-layout">
            <DesktopAside
              title="Le but du jeu"
              subtitle="Tu scans des stands pendant le festival pour progresser et gagner des badges."
              bullets={[
                "1 scan = points + badges.",
                "Ton parcours reste accessible apres.",
                "Soli'Skills prolonge l'experience.",
              ]}
              photo={PASSPORT_PHOTO_ALT}
            />

            <div className="passport-onboarding">
              <div className="passport-phone-card">
                <div className="passport-ribbon-bg" aria-hidden="true" />
                <div className="passport-sheet">
                  <h1 className="passport-sheet__title">Le but du jeu :</h1>
                  <div className="passport-goals">
                    {GOALS.map((goal) => (
                      <div key={goal} className="passport-goal-card">
                        <span className="passport-goal-icon">❂</span>
                        <p>{goal}</p>
                      </div>
                    ))}
                  </div>
                  {error ? <p className="passport-error">{error}</p> : null}
                  <button
                    type="button"
                    className="passport-primary-btn"
                    onClick={() => void createPassport()}
                    disabled={saving}
                  >
                    {saving ? "Creation..." : "J&apos;ai compris !"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <div className="passport-dashboard-layout">
          <div className="passport-dashboard" data-reveal>
            <div className="passport-dashboard__header">
              <div>
                <p className="passport-dashboard__eyebrow">
                  Salut {profile?.display_name} <span aria-hidden="true">👋</span>
                </p>
                <p className="passport-dashboard__sub">
                  Bienvenue dans ton Soli&apos;Passeport
                </p>
              </div>
              <div className="passport-dashboard__score">
                <span>{selectedAvatarData.icon}</span>
                <strong>{profile?.total_points ?? 0}</strong>
              </div>
            </div>

            <div className="passport-dashboard__book">
              <div className="passport-book passport-book--large">
                <div className="passport-badge passport-badge--top">🔒</div>
                <div className="passport-badge passport-badge--mid">🔒</div>
                <div className="passport-badge passport-badge--bottom">❂</div>
              </div>
              <div className="passport-badge-row">
                {BADGES.map((badge) => {
                  const unlocked = badge.check(scans);
                  return (
                    <div
                      key={badge.id}
                      className={`passport-badge-chip ${unlocked ? "is-unlocked" : ""}`}
                      style={{ ["--badge-color" as string]: badge.color }}
                    >
                      {badge.icon}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="passport-dashboard__section">
              <div className="passport-activity-card passport-activity-card--main">
                <div className="passport-activity-card__head">
                  <span className="passport-activity-icon">✺</span>
                  <div>
                    <h2>Cyclisme</h2>
                    <p>Participez a deux evenements</p>
                  </div>
                </div>
                <Link href="/scan" className="passport-primary-btn passport-primary-btn--small">
                  Scanner un stand
                </Link>
              </div>

              {scans.slice(0, 2).map((scan) => (
                <div key={scan.id} className="passport-activity-card">
                  <div className="passport-activity-card__head">
                    <span className="passport-activity-icon passport-activity-icon--light">
                      {scan.festival_stands?.category === "equipe" ? "🤝" : "❂"}
                    </span>
                    <div>
                      <h2>{scan.festival_stands?.name ?? "Stand valide"}</h2>
                      <p>{scan.festival_stands?.sport ?? "Activite du festival"}</p>
                    </div>
                  </div>
                  <div className="passport-progress">
                    <div
                      className="passport-progress__bar"
                      style={{ width: `${Math.min((scan.points_earned / 25) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}

              {scans.length === 0 ? (
                <div className="passport-activity-card passport-activity-card--empty">
                  <p>Tu n&apos;as encore rien scanne. Commence ton parcours sur le festival.</p>
                </div>
              ) : null}
            </div>

            <div className="passport-dashboard__footer">
              <div className="passport-dashboard__meter">
                <span>{scans.length}/{TOTAL_STANDS} stands</span>
                <div className="passport-progress">
                  <div
                    className="passport-progress__bar passport-progress__bar--yellow"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="passport-dashboard__actions">
                <Link href="/programme" className="passport-link-btn">
                  Carte
                </Link>
                <Link href="/defis" className="passport-link-btn passport-link-btn--active">
                  Defis
                </Link>
                <Link href="/classement" className="passport-link-btn">
                  Passeport
                </Link>
              </div>
            </div>
          </div>

          <div className="passport-sidecard app-card app-card--soft" data-reveal>
            <div className="app-card__content">
              <p className="app-hero__eyebrow mb-2">Prochaine etape</p>
              <h2 className="m-0 text-3xl font-extrabold text-white">Ton parcours</h2>
              <p className="mt-3 mb-0 text-white/70 leading-relaxed">
                Sur desktop, tout est plus clair: raccourcis, stats et progression au meme endroit.
              </p>

              <div className="passport-sidecard__photo">
                <img src={PASSPORT_PHOTO} alt="" loading="lazy" />
              </div>

              <div className="passport-sidecard__grid">
                <Link href="/programme" className="passport-sidecard__cta">
                  Voir le programme
                </Link>
                <Link href="/scan" className="passport-sidecard__cta passport-sidecard__cta--primary">
                  Scanner un stand
                </Link>
                <Link href="/defis" className="passport-sidecard__cta">
                  Decouvrir les defis
                </Link>
                <button
                  type="button"
                  className="passport-sidecard__cta passport-sidecard__cta--danger"
                  onClick={() => {
                    if (!profile?.session_id) return;
                    localStorage.removeItem("solimouv_session_id");
                    setProfile(null);
                    setScans([]);
                    setName("");
                    setEmail("");
                    setSelectedAvatar(AVATARS[0].id);
                    setStep("welcome");
                    setMode("signup");
                    setError(null);
                  }}
                >
                  Deconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="app-card app-card--soft" data-reveal>
          <div className="app-card__content">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="app-hero__eyebrow mb-2">Raccourcis</p>
                <h2 className="m-0 text-2xl font-extrabold text-white">
                  Continue ton parcours
                </h2>
              </div>
              <span className="app-pill">{earnedBadges.length} badges</span>
            </div>

            <div className="journey-grid">
              <Link href="/scan" className="journey-step">
                <span className="journey-step__index">1</span>
                <h3 className="journey-step__title">Scanner</h3>
                <p className="journey-step__copy">
                  Ajoute des stands et debloque des points.
                </p>
              </Link>
              <Link href="/defis" className="journey-step">
                <span className="journey-step__index">2</span>
                <h3 className="journey-step__title">Defis</h3>
                <p className="journey-step__copy">
                  Continue apres le festival avec Soli&apos;Skills.
                </p>
              </Link>
              <button
                type="button"
                className="journey-step text-left"
                onClick={() => {
                  if (!profile?.session_id) return;
                  localStorage.removeItem("solimouv_session_id");
                  setProfile(null);
                  setScans([]);
                  setName("");
                  setEmail("");
                  setSelectedAvatar(AVATARS[0].id);
                  setStep("welcome");
                  setMode("signup");
                  setError(null);
                }}
              >
                <span className="journey-step__index">3</span>
                <h3 className="journey-step__title">Deconnexion</h3>
                <p className="journey-step__copy">
                  Revenir a l&apos;ecran de creation ou connexion.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
