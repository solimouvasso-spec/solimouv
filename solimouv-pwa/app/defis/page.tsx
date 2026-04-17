"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  supabase,
  MonthlyChallenge,
  ChallengeParticipation,
  PassportScan,
  addPassportPoints,
} from "@/lib/supabase";

const MONTHS_FR = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

const SPORT_SUGGESTIONS: Record<
  string,
  { title: string; description: string; instructions: string; points: number; mood: string }[]
> = {
  Boccia: [
    {
      title: "Precision en 12 lancers",
      description: "Place 12 lancers et essaye de finir avec 5 boules dans la zone cible.",
      instructions: "Raconte ton meilleur score ou partage comment tu as adapte ton geste.",
      points: 40,
      mood: "Precision",
    },
    {
      title: "Boccia en duo",
      description: "Invite une autre personne a tester la boccia avec toi pendant au moins 15 minutes.",
      instructions: "Explique ce que vous avez appris ensemble sur le rythme et la coordination.",
      points: 35,
      mood: "Duo",
    },
  ],
  Yoga: [
    {
      title: "Routine souffle et mobilite",
      description: "Realise une mini routine inclusive de 10 minutes axee respiration et mobilite.",
      instructions: "Decris les postures ou mouvements qui t'ont fait le plus de bien.",
      points: 30,
      mood: "Equilibre",
    },
    {
      title: "Pause bien-etre en groupe",
      description: "Participe a un moment calme avec une association, un proche ou ton club.",
      instructions: "Raconte comment tu t'es senti avant et apres la seance.",
      points: 35,
      mood: "Calme",
    },
  ],
  "Basket fauteuil": [
    {
      title: "Serie de passes inclusives",
      description: "Realise une serie de 20 passes ou dribbles adaptes autour d'un atelier basket fauteuil.",
      instructions: "Indique le nombre de passes reussies ou le parcours realise.",
      points: 45,
      mood: "Energie",
    },
    {
      title: "Match-decouverte",
      description: "Teste une mini opposition ou un atelier de tir pour comprendre les sensations du jeu.",
      instructions: "Raconte ce qui change le plus dans ta perception du basket.",
      points: 50,
      mood: "Match",
    },
  ],
  Goalball: [
    {
      title: "Defi a l'ecoute",
      description: "Teste 3 sequences de goalball les yeux bandes en te concentrant sur le son et l'espace.",
      instructions: "Partage comment tu t'es repere sans la vue.",
      points: 45,
      mood: "Focus",
    },
    {
      title: "Parcours sensoriel",
      description: "Enchaine un atelier sensoriel et une initiation goalball pour travailler l'orientation.",
      instructions: "Decris le moment ou tu t'es senti le plus en confiance.",
      points: 40,
      mood: "Sensoriel",
    },
  ],
};

const FALLBACK_SUGGESTIONS = [
  {
    id: "multi-1",
    title: "Defi decouverte inclusive",
    description: "Teste un sport que tu n'as encore jamais essaye et partage ce que tu as ressenti.",
    instructions: "Le but est d'ouvrir ton parcours plutot que de performer.",
    points: 25,
    mood: "Decouverte",
  },
  {
    id: "multi-2",
    title: "Defi en binome",
    description: "Participe avec un ami, un benevole ou une association pour creer une vraie experience a deux.",
    instructions: "L'inclusion se joue aussi dans la rencontre.",
    points: 30,
    mood: "Lien",
  },
];

function getSportPreference(scans: PassportScan[]) {
  const counts = scans.reduce<Record<string, number>>((acc, scan) => {
    const sport = scan.festival_stands?.sport;
    if (!sport) return acc;
    acc[sport] = (acc[sport] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function getChallengeTone(sport: string) {
  if (sport === "Goalball") return "defis-card--yellow";
  if (sport === "Yoga") return "defis-card--lilac";
  if (sport === "Basket fauteuil") return "defis-card--teal";
  return "defis-card--soft";
}

export default function DefisPage() {
  const [challenges, setChallenges] = useState<MonthlyChallenge[]>([]);
  const [participations, setParticipations] = useState<ChallengeParticipation[]>([]);
  const [scans, setScans] = useState<PassportScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("solimouv_session_id")
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function loadData(sid: string | null) {
    const currentYear = new Date().getFullYear();

    const { data: challengeRows } = await supabase
      .from("monthly_challenges")
      .select("*")
      .eq("year", currentYear)
      .eq("active", true)
      .order("month", { ascending: false });

    setChallenges((challengeRows as MonthlyChallenge[]) || []);

    if (sid) {
      const { data: partRows } = await supabase
        .from("challenge_participations")
        .select("*")
        .eq("session_id", sid);
      setParticipations((partRows as ChallengeParticipation[]) || []);

      const { data: scanRows } = await supabase
        .from("passport_scans")
        .select("*, festival_stands(*)")
        .eq("session_id", sid);
      setScans((scanRows as PassportScan[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData(sessionId);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [sessionId]);

  async function handleParticipate(challenge: MonthlyChallenge) {
    if (!sessionId || !proofText.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("challenge_participations").insert({
      session_id: sessionId,
      challenge_id: challenge.id,
      proof_text: proofText.trim(),
      points_earned: challenge.points,
      validated: false,
    });

    if (!error) {
      await addPassportPoints(sessionId, 0, challenge.points);
      setParticipations((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          session_id: sessionId,
          challenge_id: challenge.id,
          proof_text: proofText.trim(),
          points_earned: challenge.points,
          validated: false,
          participated_at: new Date().toISOString(),
        },
      ]);
      setSuccessId(challenge.id);
      setActiveId(null);
      setProofText("");
    }

    setSubmitting(false);
  }

  function isDone(challengeId: string) {
    return participations.some((participation) => participation.challenge_id === challengeId);
  }

  const currentMonth = new Date().getMonth() + 1;
  const preferredSport = getSportPreference(scans);
  const completedCount = participations.length;
  const currentChallenges = challenges
    .filter((challenge) => challenge.month === currentMonth)
    .sort((a, b) => {
      const aPreferred = preferredSport && a.sport === preferredSport ? 1 : 0;
      const bPreferred = preferredSport && b.sport === preferredSport ? 1 : 0;
      return bPreferred - aPreferred;
    });
  const pastChallenges = challenges.filter((challenge) => challenge.month < currentMonth);
  const suggestionCards = preferredSport
    ? (SPORT_SUGGESTIONS[preferredSport] || []).map((challenge, index) => ({
        id: `${preferredSport}-${index}`,
        sport: preferredSport,
        ...challenge,
      }))
    : FALLBACK_SUGGESTIONS.map((challenge) => ({
        ...challenge,
        sport: "Multi-sports",
      }));

  if (loading) {
    return (
      <div className="app-page defis-page">
        <div className="app-page__container">
          <div className="scan-loading" role="status" aria-label="Chargement des defis">
            <div className="scan-processing__spinner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page defis-page">
      <div className="app-page__container app-grid">
        <section className="app-card defis-hero" data-reveal>
          <div className="app-card__content">
            <div className="defis-hero__layout">
              <div className="defis-hero__copy">
                <p className="app-hero__eyebrow">Toute l&apos;annee</p>
                <h1 className="app-hero__title">Defis mensuels</h1>
                <p className="app-hero__description">
                  Chaque mois, nos associations partenaires te lancent un defi sportif. On
                  priorise maintenant les suggestions qui collent a ton parcours.
                </p>

                <div className="hero-meta-grid">
                  <article className="hero-meta-card">
                    <p>Sport dominant</p>
                    <p>{preferredSport ?? "A definir"}</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>Defis valides</p>
                    <p>{completedCount}</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>Mois actif</p>
                    <p>{MONTHS_FR[currentMonth - 1]}</p>
                  </article>
                </div>

                <div className="app-hero__actions">
                  {sessionId ? (
                    <>
                      <Link href="/passeport" className="app-button app-button--primary">
                        Voir mon pass
                      </Link>
                      <Link href="/classement" className="app-button app-button--secondary">
                        Voir le classement
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/passeport" className="app-button app-button--primary">
                        Creer mon passeport
                      </Link>
                      <Link href="/passeport" className="app-button app-button--secondary">
                        Me connecter
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="defis-hero__art" aria-hidden="true">
                <div className="defis-orbit defis-orbit--one" />
                <div className="defis-orbit defis-orbit--two" />
                <div className="defis-sticker defis-sticker--yellow">+40</div>
                <div className="defis-sticker defis-sticker--lilac">DUO</div>
                <div className="defis-panel">
                  <span className="app-pill">Suggestion</span>
                  <strong>{preferredSport ?? "Multi-sports"}</strong>
                  <p>
                    {preferredSport
                      ? "On te pousse des defis proches de ce que tu explores deja."
                      : "Active ton passeport pour recevoir des recommandations plus fines."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!sessionId ? (
          <section className="app-card app-card--soft" data-reveal>
            <div className="app-card__content defis-cta">
              <div>
                <p className="app-hero__eyebrow mb-2">Passeport requis</p>
                <h2 className="section-title">Connecte-toi pour relever les defis</h2>
                <p className="app-hero__description max-w-none">
                  Sans passeport, on ne peut pas enregistrer tes participations ni te proposer
                  des defis adaptes a ton profil.
                </p>
              </div>
              <div className="defis-cta__actions">
                <Link href="/passeport" className="app-button app-button--primary">
                  Creer mon pass
                </Link>
                <Link href="/passeport" className="app-button app-button--secondary">
                  Me connecter
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="app-card app-card--soft" data-reveal aria-label="Suggestions personnalisees">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Pour toi</p>
              <h2 className="section-title">
                {preferredSport
                  ? `Defis recommandes autour de ${preferredSport}`
                  : "Quelques idees pour lancer ton parcours"}
              </h2>
              <p className="app-hero__description">
                {preferredSport
                  ? "Ces suggestions sont basees sur les stands et activites que tu as deja explores."
                  : "On n'a pas encore assez de donnees, donc on te propose des defis multi-sports pour commencer."}
              </p>
            </div>

            <div className="highlights-grid stagger-list">
              {suggestionCards.map((challenge, index) => (
                <article
                  key={challenge.id}
                  className={`highlight-card ${getChallengeTone(challenge.sport)}`}
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill">{challenge.sport}</span>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <p className="highlight-card__note">{challenge.instructions}</p>
                  <div className="scan-spot-card__actions">
                    <span className="app-button app-button--secondary">+{challenge.points} pts</span>
                    <span className="app-button app-button--ghost">{challenge.mood}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card" data-reveal aria-labelledby="current-heading">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Mois en cours</p>
              <h2 id="current-heading" className="section-title">
                Defi du mois · {MONTHS_FR[currentMonth - 1]}
              </h2>
            </div>

            {currentChallenges.length === 0 ? (
              <div className="defis-empty">
                <div className="defis-empty__art" aria-hidden="true">
                  <span className="defis-empty__dot defis-empty__dot--one" />
                  <span className="defis-empty__dot defis-empty__dot--two" />
                  <span className="defis-empty__icon">✦</span>
                </div>
                <div>
                  <h3>Aucun defi publie pour ce mois</h3>
                  <p>
                    Les associations preparent le prochain challenge. En attendant, tu peux
                    avancer sur le parcours, scanner des stands et enrichir ton profil.
                  </p>
                </div>
                <div className="defis-empty__actions">
                  <Link href={sessionId ? "/programme" : "/passeport"} className="app-button app-button--primary">
                    {sessionId ? "Voir la carte" : "Creer mon pass"}
                  </Link>
                  <Link href={sessionId ? "/scan" : "/passeport"} className="app-button app-button--secondary">
                    {sessionId ? "Scanner un stand" : "Me connecter"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="timeline stagger-list">
                {currentChallenges.map((challenge, index) => {
                  const done = isDone(challenge.id);
                  const success = successId === challenge.id;
                  const isActive = activeId === challenge.id;

                  return (
                    <article
                      key={challenge.id}
                      className="timeline-item"
                      data-reveal
                      style={{ ["--stagger-index" as string]: index }}
                    >
                      <time className="timeline-time" dateTime={`2026-${String(currentMonth).padStart(2, "0")}-01`}>
                        +{challenge.points}
                      </time>
                      <div className="timeline-card">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="app-pill">{challenge.sport}</span>
                          {preferredSport === challenge.sport ? (
                            <span className="map-chip map-chip--yellow">Recommande</span>
                          ) : null}
                        </div>

                        <h3 className="timeline-card__title">{challenge.title}</h3>
                        <p className="timeline-card__copy">{challenge.description}</p>

                        {challenge.instructions ? (
                          <p className="highlight-card__note">Conseil: {challenge.instructions}</p>
                        ) : null}

                        {done || success ? (
                          <div className="defis-status">
                            <span>✅</span>
                            <span>
                              {success
                                ? "Participation enregistree. L'association peut maintenant la verifier."
                                : "Tu as deja releve ce defi."}
                            </span>
                          </div>
                        ) : sessionId ? (
                          isActive ? (
                            <div className="defis-form">
                              <label htmlFor={`proof-${challenge.id}`} className="defis-form__label">
                                Raconte ta participation
                              </label>
                              <textarea
                                id={`proof-${challenge.id}`}
                                value={proofText}
                                onChange={(event) => setProofText(event.target.value)}
                                placeholder="Ex: J'ai participe a une initiation avec mon club et j'ai decouvert..."
                                rows={4}
                                className="passport-input"
                              />
                              <div className="defis-form__actions">
                                <button
                                  type="button"
                                  onClick={() => handleParticipate(challenge)}
                                  disabled={submitting || !proofText.trim()}
                                  className="app-button app-button--primary"
                                >
                                  {submitting ? "Envoi..." : "Valider ma participation"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveId(null);
                                    setProofText("");
                                  }}
                                  className="app-button app-button--secondary"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="scan-spot-card__actions">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveId(challenge.id);
                                  setProofText(challenge.title);
                                }}
                                className="app-button app-button--primary"
                              >
                                Relever le defi
                              </button>
                              <Link href="/programme" className="app-button app-button--secondary">
                                Voir les activites
                              </Link>
                            </div>
                          )
                        ) : (
                          <div className="scan-spot-card__actions">
                            <Link href="/passeport" className="app-button app-button--primary">
                              Creer mon pass
                            </Link>
                            <Link href="/passeport" className="app-button app-button--secondary">
                              Me connecter
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {pastChallenges.length > 0 ? (
          <section className="app-card" data-reveal aria-labelledby="past-heading">
            <div className="app-card__content">
              <div className="section-heading">
                <p className="app-hero__eyebrow">Archives</p>
                <h2 id="past-heading" className="section-title">
                  Defis precedents
                </h2>
              </div>

              <div className="support-grid stagger-list">
                {pastChallenges.map((challenge, index) => (
                  <article
                    key={challenge.id}
                    className="support-card"
                    data-reveal
                    style={{ ["--stagger-index" as string]: index }}
                  >
                    <div className="support-card__icon">{isDone(challenge.id) ? "✅" : "✦"}</div>
                    <div>
                      <p className="support-card__title">
                        {MONTHS_FR[challenge.month - 1]} · {challenge.sport}
                      </p>
                      <p className="support-card__copy">{challenge.title}</p>
                    </div>
                    <span className="app-pill">
                      {isDone(challenge.id) ? "Fait" : `+${challenge.points} pts`}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="app-card app-card--soft" data-reveal>
          <div className="app-card__content defis-cta">
            <div>
              <p className="app-hero__eyebrow mb-2">Associations</p>
              <h2 className="section-title">Proposer un defi mensuel</h2>
              <p className="app-hero__description max-w-none">
                Si tu representes une association, tu peux soumettre un nouveau challenge et
                nourrir le parcours toute l&apos;annee.
              </p>
            </div>
            <div className="defis-cta__actions">
              <Link href="/contact" className="app-button app-button--primary">
                Proposer un defi
              </Link>
              <Link href="/classement" className="app-button app-button--secondary">
                Voir le classement
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
