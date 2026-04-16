import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Quiz — Sport inclusif",
    description:
      "Testez vos connaissances sur le sport inclusif et le handisport avec notre quiz interactif.",
  };
}

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    id: 1,
    question: "Combien de sports sont au programme des Jeux Paralympiques d'été ?",
    options: ["12", "22", "29", "35"],
    answer: 2,
  },
  {
    id: 2,
    question: "Qu'est-ce que le boccia ?",
    options: [
      "Un sport nautique",
      "Un sport de précision accessible aux handicaps moteurs sévères",
      "Une forme de boxe adaptée",
      "Un sport de raquette",
    ],
    answer: 1,
  },
  {
    id: 3,
    question: "Le goalball est pratiqué par des personnes ayant...",
    options: [
      "Un handicap moteur",
      "Un handicap auditif",
      "Un handicap visuel",
      "Un handicap cognitif",
    ],
    answer: 2,
  },
  {
    id: 4,
    question: "Quel pays a remporté le plus de médailles paralympiques en 2024 ?",
    options: ["États-Unis", "Chine", "Grande-Bretagne", "France"],
    answer: 1,
  },
  {
    id: 5,
    question: "Le fauteuil de basket utilisé en compétition est...",
    options: [
      "Le fauteuil roulant quotidien du joueur",
      "Un fauteuil standardisé réglementaire",
      "Un fauteuil conçu spécifiquement pour le sport",
      "N'importe quel fauteuil disponible",
    ],
    answer: 2,
  },
];

export default function QuizPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          5 questions · 2 minutes
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Quiz Sport Inclusif
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Testez vos connaissances sur le handisport et le sport adapté. Bonne
          chance !
        </p>
      </header>

      <section aria-label="Quiz de connaissances sur le sport inclusif">
        <ol className="space-y-8" role="list">
          {questions.map((q, idx) => (
            <li
              key={q.id}
              className="bg-navy-light rounded-2xl p-6 border border-teal/10"
            >
              <p
                id={`question-${q.id}`}
                className="text-white font-semibold text-lg mb-4"
              >
                <span className="text-teal mr-2" aria-hidden="true">
                  {idx + 1}.
                </span>
                {q.question}
              </p>
              <fieldset aria-labelledby={`question-${q.id}`}>
                <legend className="sr-only">
                  Question {q.id} : {q.question}
                </legend>
                <div className="space-y-3">
                  {q.options.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-teal/20 hover:border-teal/50 hover:bg-teal/5 transition-colors has-[:checked]:border-teal has-[:checked]:bg-teal/10"
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIdx}
                        className="accent-teal"
                        aria-label={`Réponse ${optIdx + 1} : ${option}`}
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <button
            type="button"
            className="px-10 py-4 bg-teal text-navy font-bold text-lg rounded-full hover:bg-teal/90 transition-colors"
            aria-label="Valider mes réponses au quiz"
          >
            Valider mes réponses
          </button>
        </div>
      </section>
    </div>
  );
}
