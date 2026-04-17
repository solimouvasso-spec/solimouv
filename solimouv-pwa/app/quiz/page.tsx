"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addPassportPoints, supabase } from "@/lib/supabase";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Combien de sports sont au programme des Jeux Paralympiques d'ete ?",
    options: ["12", "22", "29", "35"],
    answer: 2,
    explanation: "Les Jeux Paralympiques d'ete comptent 29 sports.",
  },
  {
    id: 2,
    question: "Qu'est-ce que le boccia ?",
    options: [
      "Un sport nautique",
      "Un sport de precision accessible aux handicaps moteurs severes",
      "Une forme de boxe adaptee",
      "Un sport de raquette",
    ],
    answer: 1,
    explanation: "Le boccia est un sport de precision pense pour etre tres accessible.",
  },
  {
    id: 3,
    question: "Le goalball est pratique par des personnes ayant...",
    options: [
      "Un handicap moteur",
      "Un handicap auditif",
      "Un handicap visuel",
      "Un handicap cognitif",
    ],
    answer: 2,
    explanation: "Le goalball est un sport paralympique pour personnes malvoyantes ou non-voyantes.",
  },
  {
    id: 4,
    question: "Le fauteuil de basket utilise en competition est...",
    options: [
      "Le fauteuil quotidien du joueur",
      "Un fauteuil standardise unique",
      "Un fauteuil concu specifiquement pour le sport",
      "N'importe quel fauteuil disponible",
    ],
    answer: 2,
    explanation: "Le fauteuil sportif est concu pour la performance, la securite et la maniabilite.",
  },
  {
    id: 5,
    question: "Pourquoi Solimouv valorise aussi les defis et la rencontre ?",
    options: [
      "Pour faire un championnat strict",
      "Pour prolonger l'inclusion au-dela du festival",
      "Pour limiter les activites sur place",
      "Pour supprimer les associations",
    ],
    answer: 1,
    explanation: "L'idee est de prolonger l'experience inclusive toute l'annee.",
  },
];

const MAX_POINTS = 50;
const QUIZ_CHALLENGE_KEY = "solimouv_quiz_challenge_done";

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionId] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("solimouv_session_id")
  );
  const [alreadyRewarded, setAlreadyRewarded] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const sid = localStorage.getItem("solimouv_session_id");
    return sid
      ? localStorage.getItem(`${QUIZ_CHALLENGE_KEY}:${sid}`) === "done"
      : localStorage.getItem(QUIZ_CHALLENGE_KEY) === "guest-done";
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    void supabase
      .from("quiz_results")
      .select("id, score")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAlreadyRewarded(true);
        }
      });
  }, [sessionId]);

  const score = useMemo(
    () =>
      QUESTIONS.reduce((total, question) => {
        return total + (answers[question.id] === question.answer ? 1 : 0);
      }, 0),
    [answers]
  );

  const pointsEarned = Math.round((score / QUESTIONS.length) * MAX_POINTS);
  const canSubmit = QUESTIONS.every((question) => answers[question.id] !== undefined);

  function selectAnswer(questionId: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    setSaveMessage(null);

    if (!sessionId) {
      localStorage.setItem(QUIZ_CHALLENGE_KEY, "guest-done");
      setSaveMessage("Quiz valide. Cree ton passeport pour convertir ce defi en progression reconnue.");
      return;
    }

    if (alreadyRewarded) {
      setSaveMessage("Ton quiz est enregistre. Tu peux le rejouer pour t'ameliorer, mais les points n'ont deja ete comptes qu'une fois.");
      return;
    }

    setSaving(true);

    const payload = {
      session_id: sessionId,
      answers,
      score,
    };

    const { error } = await supabase.from("quiz_results").insert(payload);

    if (!error) {
      await addPassportPoints(sessionId, 0, pointsEarned);
      localStorage.setItem(`${QUIZ_CHALLENGE_KEY}:${sessionId}`, "done");
      setAlreadyRewarded(true);
      setSaveMessage(`Defi quiz valide. ${pointsEarned} points ajoutes a ton passeport.`);
    } else {
      setSaveMessage("Le score est calcule, mais l'enregistrement automatique n'a pas abouti. Reessaie plus tard.");
    }

    setSaving(false);
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
    setSaveMessage(null);
  }

  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <section className="app-card" data-reveal>
          <div className="app-card__content">
            <div className="defis-hero__layout">
              <div className="defis-hero__copy">
                <p className="app-hero__eyebrow">Defi quiz · 5 questions</p>
                <h1 className="app-hero__title">Quiz sport inclusif</h1>
                <p className="app-hero__description">
                  Ce quiz devient un vrai defi du parcours. Tu testes tes connaissances, tu
                  obtiens un score, et tu peux gagner jusqu&apos;a {MAX_POINTS} points.
                </p>

                <div className="hero-meta-grid">
                  <article className="hero-meta-card">
                    <p>Questions</p>
                    <p>{QUESTIONS.length}</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>Gain max</p>
                    <p>{MAX_POINTS} pts</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>Statut</p>
                    <p>{sessionId ? "Passeport actif" : "Sans pass"}</p>
                  </article>
                </div>

                <div className="app-hero__actions">
                  <Link href={sessionId ? "/passeport" : "/passeport"} className="app-button app-button--primary">
                    {sessionId ? "Voir mon pass" : "Creer mon pass"}
                  </Link>
                  <Link href="/defis" className="app-button app-button--secondary">
                    Retour aux defis
                  </Link>
                </div>
              </div>

              <div className="defis-hero__art" aria-hidden="true">
                <div className="defis-orbit defis-orbit--one" />
                <div className="defis-orbit defis-orbit--two" />
                <div className="defis-sticker defis-sticker--yellow">QUIZ</div>
                <div className="defis-sticker defis-sticker--lilac">+PTS</div>
                <div className="defis-panel">
                  <span className="app-pill">Mode defi</span>
                  <strong>Score + recompense</strong>
                  <p>Plus tu reponds juste, plus tu montes en points dans ton passeport.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="app-card app-card--soft" data-reveal aria-labelledby="quiz-heading">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Connaissances</p>
              <h2 id="quiz-heading" className="section-title">
                Releve le defi
              </h2>
            </div>

            <div className="timeline stagger-list">
              {QUESTIONS.map((question, index) => (
                <article
                  key={question.id}
                  className="timeline-item"
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <time className="timeline-time" dateTime={`q-${question.id}`}>
                    {question.id}
                  </time>
                  <div className="timeline-card">
                    <h3 className="timeline-card__title">{question.question}</h3>
                    <div className="scan-spot-grid scan-spot-grid--stack">
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[question.id] === optionIndex;
                        const correct = question.answer === optionIndex;
                        const showState = submitted && selected;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => selectAnswer(question.id, optionIndex)}
                            className={`scan-spot-card ${selected ? "is-active" : ""}`}
                            style={
                              submitted && correct
                                ? { borderColor: "rgba(248, 243, 93, 0.45)" }
                                : undefined
                            }
                          >
                            <div className="scan-spot-card__top">
                              <span className="scan-spot-card__code">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              {showState ? (
                                <span className="app-pill">{correct ? "Juste" : "Choisie"}</span>
                              ) : null}
                            </div>
                            <p className="m-0 text-left">{option}</p>
                          </button>
                        );
                      })}
                    </div>

                    {submitted ? (
                      <p className="highlight-card__note">Reponse: {question.explanation}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="app-card app-card--soft mt-6">
              <div className="app-card__content defis-cta">
                <div>
                  <p className="app-hero__eyebrow mb-2">Resultat</p>
                  <h2 className="section-title">
                    {submitted ? `${score}/${QUESTIONS.length} bonnes reponses` : "Valide ton quiz"}
                  </h2>
                  <p className="app-hero__description max-w-none">
                    {submitted
                      ? `Tu as debloque ${pointsEarned} points potentiels sur ${MAX_POINTS}.`
                      : "Reponds aux 5 questions pour transformer ce quiz en defi a points."}
                  </p>
                  {saveMessage ? <p className="highlight-card__note">{saveMessage}</p> : null}
                </div>

                <div className="defis-cta__actions">
                  {!submitted ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit || saving}
                      className="app-button app-button--primary"
                    >
                      {saving ? "Validation..." : "Valider mes reponses"}
                    </button>
                  ) : (
                    <button type="button" onClick={resetQuiz} className="app-button app-button--secondary">
                      Rejouer le quiz
                    </button>
                  )}
                  <Link href="/classement" className="app-button app-button--secondary">
                    Voir le classement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
