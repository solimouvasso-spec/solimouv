import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Associations",
    description:
      "Découvrez les associations partenaires du festival Solimouv' qui œuvrent pour le sport inclusif à Paris.",
  };
}

type Association = {
  name: string;
  sport: string;
  description: string;
  contact: string;
  tags: string[];
};

const associations: Association[] = [
  {
    name: "Paris Basket Fauteuil",
    sport: "Basket-ball en fauteuil",
    description:
      "Club parisien de basket en fauteuil roulant, accueillant tous les niveaux depuis 2005.",
    contact: "contact@pbf.fr",
    tags: ["Fauteuil", "Compétition", "Loisir"],
  },
  {
    name: "Goalball Île-de-France",
    sport: "Goalball",
    description:
      "Association dédiée au goalball paralympique pour personnes déficientes visuelles.",
    contact: "info@goalball-idf.fr",
    tags: ["Déficience visuelle", "Paralympique"],
  },
  {
    name: "HandiNatation Paris",
    sport: "Natation adaptée",
    description:
      "Cours de natation adaptée à tous les handicaps dans 5 piscines parisiennes.",
    contact: "nager@handi-natation.fr",
    tags: ["Natation", "Aquatique", "Tous handicaps"],
  },
  {
    name: "Boccia Club de Paris",
    sport: "Boccia",
    description:
      "Sport de précision accessible aux personnes avec handicap moteur. Compétition et loisir.",
    contact: "boccia@paris.fr",
    tags: ["Précision", "Moteur", "Tous âges"],
  },
  {
    name: "Yoga Inclusif Paris",
    sport: "Yoga adapté",
    description:
      "Cours de yoga et de pleine conscience adaptés à toutes les morphologies et capacités.",
    contact: "hello@yoga-inclusif.fr",
    tags: ["Bien-être", "Adapté", "Débutant"],
  },
  {
    name: "Tennis Fauteuil Île-de-France",
    sport: "Tennis en fauteuil",
    description:
      "Initiation et entraînement au tennis fauteuil. Partenaire de la FFT.",
    contact: "tennis@fauteuil-idf.fr",
    tags: ["Fauteuil", "Raquette", "FFT"],
  },
];

export default function AssociationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Partenaires 2025
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Associations
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Plus de 30 associations seront présentes lors du festival. Voici
          quelques-unes de nos partenaires engagées dans le sport inclusif.
        </p>
      </header>

      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Liste des associations partenaires"
      >
        {associations.map((asso) => (
          <li
            key={asso.name}
            className="bg-navy-light rounded-2xl p-6 border border-teal/10 hover:border-teal/30 transition-colors flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg mb-1">{asso.name}</h2>
              <p className="text-teal text-sm font-medium mb-3">{asso.sport}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {asso.description}
              </p>
              <ul className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Tags">
                {asso.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`mailto:${asso.contact}`}
              className="inline-flex items-center text-sm text-gray-400 hover:text-teal transition-colors"
              aria-label={`Contacter ${asso.name} par email`}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {asso.contact}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">
          Vous représentez une association ?
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-teal text-teal font-semibold rounded-full hover:bg-teal/10 transition-colors"
          aria-label="Contacter l'organisation pour rejoindre le festival"
        >
          Rejoindre le festival
        </a>
      </div>
    </div>
  );
}
