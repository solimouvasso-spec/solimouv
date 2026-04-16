import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "À propos",
    description:
      "Découvrez Up Sport! Paris et la mission du festival Solimouv' : rendre le sport accessible à tous, sans distinction.",
  };
}

const values = [
  {
    title: "Inclusivité",
    description:
      "Chaque activité est pensée pour accueillir toutes les personnes, quel que soit leur niveau ou leur situation.",
    color: "border-teal",
  },
  {
    title: "Bienveillance",
    description:
      "Un espace safe où l'on peut essayer, se tromper, se dépasser — sans jugement.",
    color: "border-accent",
  },
  {
    title: "Communauté",
    description:
      "Créer des liens durables entre associations, pratiquants et partenaires.",
    color: "border-teal",
  },
  {
    title: "Innovation",
    description:
      "Utiliser la technologie (matching Wasm, PWA) pour ouvrir l'accès au sport à plus de personnes.",
    color: "border-accent",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <header className="text-center mb-16">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Qui sommes-nous ?
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          À propos de Solimouv&apos;
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
          Solimouv&apos; est le festival annuel du sport inclusif organisé par{" "}
          <strong className="text-teal">Up Sport! Paris</strong>, association
          dédiée à la pratique sportive adaptée dans la capitale.
        </p>
      </header>

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="mb-16">
        <h2
          id="mission-heading"
          className="text-2xl font-bold text-white mb-4"
        >
          Notre mission
        </h2>
        <div className="bg-navy-light rounded-2xl p-8 border border-teal/20">
          <p className="text-gray-300 leading-relaxed mb-4">
            Depuis sa création, Up Sport! Paris milite pour que chaque Parisien,
            quel que soit son handicap, son âge ou son niveau, puisse accéder à
            une pratique sportive régulière et épanouissante.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Solimouv&apos; est notre vitrine annuelle : une journée entière
            dédiée aux démonstrations, rencontres et initiations, pour montrer
            que le sport est vraiment pour <em className="text-white">tous</em>.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section aria-labelledby="values-heading" className="mb-16">
        <h2
          id="values-heading"
          className="text-2xl font-bold text-white mb-8"
        >
          Nos valeurs
        </h2>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          role="list"
        >
          {values.map(({ title, description, color }) => (
            <li
              key={title}
              className={`bg-navy-light rounded-xl p-6 border-l-4 ${color}`}
            >
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Équipe */}
      <section aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl font-bold text-white mb-6">
          L&apos;équipe
        </h2>
        <div className="bg-navy-light rounded-2xl p-8 border border-teal/20 text-center">
          <p className="text-gray-300 leading-relaxed">
            Solimouv&apos; est porté par une équipe de{" "}
            <strong className="text-white">bénévoles passionnés</strong> et
            soutenu par des partenaires institutionnels et privés.
          </p>
          <p className="text-gray-400 text-sm mt-4">
            Vous souhaitez rejoindre l&apos;aventure ?{" "}
            <a
              href="/contact"
              className="text-teal hover:underline"
              aria-label="Contacter l'équipe pour rejoindre l'organisation"
            >
              Contactez-nous
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
