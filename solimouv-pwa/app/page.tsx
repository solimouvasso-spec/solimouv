import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solimouv' — Festival du sport inclusif",
  description:
    "Découvrez Solimouv', le festival parisien qui célèbre le sport pour tous. Activités adaptées, associations, concerts et bien plus.",
};

const highlights = [
  {
    icon: "🏅",
    title: "Sports adaptés",
    description:
      "Plus de 20 disciplines sportives accessibles à tous les niveaux et toutes les situations de handicap.",
  },
  {
    icon: "🤝",
    title: "Associations",
    description:
      "Rencontrez les associations locales qui œuvrent chaque jour pour un sport plus inclusif.",
  },
  {
    icon: "🎯",
    title: "Matching sportif",
    description:
      "Notre algorithme vous trouve l'activité adaptée à votre profil et vos envies.",
  },
  {
    icon: "🎶",
    title: "Animations",
    description:
      "Concerts, démonstrations, ateliers — une journée festive et bienveillante.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-navy-dark"
      >
        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #00C9A7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E63946 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
          <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-4">
            Festival du sport inclusif
          </p>
          <h1
            id="hero-heading"
            className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Soli
            <span className="text-accent">mouv</span>
            <span className="text-teal">&apos;</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Le sport pour <strong className="text-white">tous</strong>, célébré
            ensemble. Une journée d&apos;inclusion, de rencontres et de
            mouvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programme"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors text-lg"
              aria-label="Voir le programme du festival"
            >
              Voir le programme
            </Link>
            <Link
              href="/match"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal text-teal font-semibold rounded-full hover:bg-teal/10 transition-colors text-lg"
              aria-label="Trouver mon sport adapté"
            >
              Trouver mon sport
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section
        aria-labelledby="highlights-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <h2
          id="highlights-heading"
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-4"
        >
          Qu&apos;est-ce qui vous attend ?
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
          Un festival pensé pour que chacun trouve sa place et vive une
          expérience unique.
        </p>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
        >
          {highlights.map(({ icon, title, description }) => (
            <li
              key={title}
              className="bg-navy-light rounded-2xl p-6 border border-teal/10 hover:border-teal/40 transition-colors"
            >
              <span
                className="text-4xl mb-4 block"
                role="img"
                aria-label={title}
              >
                {icon}
              </span>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA quiz */}
      <section
        aria-labelledby="quiz-cta-heading"
        className="bg-teal/10 border-y border-teal/20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2
            id="quiz-cta-heading"
            className="text-3xl font-bold text-white mb-4"
          >
            Pas sûr(e) de quel sport vous correspond ?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Faites notre quiz de 2 minutes et découvrez l&apos;activité faite
            pour vous.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors text-lg"
            aria-label="Commencer le quiz sport inclusif"
          >
            Commencer le quiz
          </Link>
        </div>
      </section>

      {/* Don section */}
      <section
        aria-labelledby="don-cta-heading"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <h2 id="don-cta-heading" className="text-2xl font-bold text-white mb-4">
          Soutenez le sport inclusif
        </h2>
        <p className="text-gray-400 mb-8">
          Votre don permet à Up Sport! Paris de financer des équipements adaptés
          et des activités gratuites.
        </p>
        <Link
          href="/don"
          className="inline-flex items-center justify-center px-6 py-3 bg-accent/20 border border-accent text-accent font-semibold rounded-full hover:bg-accent/30 transition-colors"
          aria-label="Faire un don à Up Sport Paris"
        >
          Faire un don ❤
        </Link>
      </section>
    </>
  );
}
