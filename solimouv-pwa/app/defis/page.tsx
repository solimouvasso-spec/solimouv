"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, MonthlyChallenge, ChallengeParticipation, addPassportPoints } from "@/lib/supabase";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const CATEGORY_COLORS: Record<string, string> = {
  Boccia: "text-accent border-accent/30 bg-accent/10",
  Yoga: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Basket fauteuil": "text-teal border-teal/30 bg-teal/10",
  Goalball: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
};

export default function DefisPage() {
  const [challenges, setChallenges] = useState<MonthlyChallenge[]>([]);
  const [participations, setParticipations] = useState<ChallengeParticipation[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulaire de participation
  const [activeId, setActiveId] = useState<string | null>(null);
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const sid = localStorage.getItem("solimouv_session_id");
    setSessionId(sid);
    loadData(sid);
  }, []);

  async function loadData(sid: string | null) {
    const currentYear = new Date().getFullYear();

    const { data } = await supabase
      .from("monthly_challenges")
      .select("*")
      .eq("year", currentYear)
      .eq("active", true)
      .order("month", { ascending: false });

    setChallenges((data as MonthlyChallenge[]) || []);

    if (sid) {
      const { data: parts } = await supabase
        .from("challenge_participations")
        .select("*")
        .eq("session_id", sid);
      setParticipations((parts as ChallengeParticipation[]) || []);
    }

    setLoading(false);
  }

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

      // Mise à jour optimiste locale
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

  function isDone(challengeId: string): boolean {
    return participations.some((p) => p.challenge_id === challengeId);
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentChallenges = challenges.filter((c) => c.month === currentMonth);
  const pastChallenges = challenges.filter((c) => c.month < currentMonth);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        role="status"
        aria-label="Chargement des défis"
      >
        <div className="animate-spin w-12 h-12 border-4 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* En-tête */}
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Toute l&apos;année
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Défis mensuels
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Chaque mois, nos associations partenaires te lancent un défi sportif.
          Relève-le pour gagner des points et grimper au classement !
        </p>
      </header>

      {/* Pas de passeport */}
      {!sessionId && (
        <aside
          className="mb-8 p-4 rounded-xl bg-accent/10 border border-accent/30 text-center"
          role="note"
        >
          <p className="text-gray-300 mb-3 text-sm">
            Crée ton Soli&apos;Passeport pour participer aux défis et gagner des
            points !
          </p>
          <Link
            href="/passeport"
            className="inline-block px-6 py-2 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors text-sm"
            aria-label="Créer mon Soli'Passeport"
          >
            Créer mon passeport
          </Link>
        </aside>
      )}

      {/* Défi du mois courant */}
      <section aria-labelledby="current-heading" className="mb-10">
        <h2 id="current-heading" className="text-xl font-bold text-white mb-5">
          Défi du mois —{" "}
          <span className="text-teal">{MONTHS_FR[currentMonth - 1]}</span>
        </h2>

        {currentChallenges.length === 0 ? (
          <div className="text-center py-12 bg-navy-light rounded-2xl border border-teal/10">
            <span className="text-4xl block mb-3" role="img" aria-label="Calendrier">
              📅
            </span>
            <p className="text-gray-400">
              Aucun défi pour ce mois. Les associations préparent le prochain !
            </p>
          </div>
        ) : (
          <ul className="space-y-4" role="list">
            {currentChallenges.map((challenge) => {
              const done = isDone(challenge.id);
              const success = successId === challenge.id;
              const isActive = activeId === challenge.id;
              const sportColor =
                CATEGORY_COLORS[challenge.sport] ||
                "text-teal border-teal/30 bg-teal/10";

              return (
                <li
                  key={challenge.id}
                  className={`bg-navy-light rounded-2xl p-6 border-2 transition-all ${
                    done ? "border-teal" : "border-teal/20 hover:border-teal/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${sportColor}`}
                      >
                        {challenge.sport}
                      </span>
                      <h3 className="text-white font-bold text-lg leading-snug">
                        {challenge.title}
                      </h3>
                    </div>
                    <span className="shrink-0 bg-teal/20 text-teal text-sm font-bold px-3 py-1.5 rounded-full">
                      +{challenge.points} pts
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {challenge.description}
                  </p>

                  {challenge.instructions && (
                    <p className="text-gray-600 text-xs mb-4 leading-relaxed border-l-2 border-teal/20 pl-3">
                      💡 {challenge.instructions}
                    </p>
                  )}

                  {/* État participation */}
                  {done || success ? (
                    <div
                      className="flex items-center gap-2 text-teal font-semibold text-sm"
                      role="status"
                    >
                      <span role="img" aria-label="Validé">✅</span>
                      {success
                        ? "Participation enregistrée ! En attente de validation par l'asso."
                        : "Tu as déjà relevé ce défi !"}
                    </div>
                  ) : sessionId ? (
                    isActive ? (
                      <div className="space-y-3 mt-2">
                        <label
                          htmlFor={`proof-${challenge.id}`}
                          className="block text-sm font-medium text-gray-300"
                        >
                          Décris ta participation{" "}
                          <span aria-hidden="true" className="text-accent">
                            *
                          </span>
                        </label>
                        <textarea
                          id={`proof-${challenge.id}`}
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          placeholder="Ex: J'ai testé le boccia avec 3 amis pendant 45 min au parc..."
                          rows={3}
                          required
                          aria-required="true"
                          className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleParticipate(challenge)}
                            disabled={submitting || !proofText.trim()}
                            className="flex-1 py-2.5 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Valider ma participation au défi"
                          >
                            {submitting ? "Envoi..." : "Valider ma participation"}
                          </button>
                          <button
                            onClick={() => {
                              setActiveId(null);
                              setProofText("");
                            }}
                            className="py-2.5 px-4 border border-gray-700 text-gray-400 rounded-full text-sm hover:bg-white/5 transition-colors"
                            aria-label="Annuler"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveId(challenge.id)}
                        className="py-2.5 px-6 bg-accent text-white font-bold rounded-full hover:bg-accent/90 transition-colors text-sm"
                        aria-label={`Relever le défi : ${challenge.title}`}
                      >
                        Relever le défi 🎯
                      </button>
                    )
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Défis passés */}
      {pastChallenges.length > 0 && (
        <section aria-labelledby="past-heading">
          <h2 id="past-heading" className="text-xl font-bold text-white mb-4">
            Défis précédents
          </h2>
          <ul className="space-y-2" role="list">
            {pastChallenges.map((challenge) => {
              const done = isDone(challenge.id);
              return (
                <li
                  key={challenge.id}
                  className={`flex items-center justify-between bg-navy-light rounded-xl px-5 py-4 border transition-all ${
                    done ? "border-teal/40" : "border-teal/10 opacity-70"
                  }`}
                >
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">
                      {MONTHS_FR[challenge.month - 1]} · {challenge.sport}
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {challenge.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    {done ? (
                      <span
                        className="text-teal text-sm font-semibold"
                        aria-label="Défi complété"
                      >
                        ✅ Fait
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">
                        +{challenge.points} pts
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* CTA bas de page */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4 text-sm">
          Tu représentes une association ? Propose un défi mensuel !
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-teal text-teal font-semibold rounded-full hover:bg-teal/10 transition-colors text-sm"
          aria-label="Contacter pour proposer un défi"
        >
          Proposer un défi
        </Link>
      </div>
    </div>
  );
}
