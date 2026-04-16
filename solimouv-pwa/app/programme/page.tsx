import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Programme",
    description:
      "Consultez le programme complet du festival Solimouv' : horaires, activités sportives, démonstrations et animations.",
  };
}

type Activity = {
  time: string;
  title: string;
  description: string;
  location: string;
  tag: string;
  tagColor: string;
};

const schedule: Activity[] = [
  {
    time: "09:00",
    title: "Ouverture du festival",
    description: "Accueil des visiteurs, mot d'ouverture par Up Sport! Paris.",
    location: "Scène principale",
    tag: "Cérémonie",
    tagColor: "bg-teal/20 text-teal",
  },
  {
    time: "09:30",
    title: "Initiation au boccia",
    description:
      "Sport de précision accessible aux personnes en situation de handicap moteur sévère.",
    location: "Zone A",
    tag: "Sport adapté",
    tagColor: "bg-accent/20 text-accent",
  },
  {
    time: "10:00",
    title: "Démo : Basket fauteuil",
    description:
      "Démonstration par les champions de l'équipe de Paris. Initiation ouverte à tous.",
    location: "Terrain central",
    tag: "Démonstration",
    tagColor: "bg-teal/20 text-teal",
  },
  {
    time: "11:00",
    title: "Atelier yoga inclusif",
    description:
      "Séance de yoga adaptée à tous les corps et toutes les capacités.",
    location: "Zone B",
    tag: "Atelier",
    tagColor: "bg-accent/20 text-accent",
  },
  {
    time: "12:00",
    title: "Pause déjeuner — Food trucks",
    description: "Restauration sur place avec des prestataires partenaires.",
    location: "Espace détente",
    tag: "Restauration",
    tagColor: "bg-gray-600/40 text-gray-300",
  },
  {
    time: "13:30",
    title: "Forum des associations",
    description:
      "Rencontrez 30 associations parisiennes spécialisées dans le sport inclusif.",
    location: "Hall principal",
    tag: "Forum",
    tagColor: "bg-teal/20 text-teal",
  },
  {
    time: "14:30",
    title: "Initiation au goalball",
    description:
      "Sport paralympique pour personnes déficientes visuelles — jouez les yeux bandés !",
    location: "Zone C",
    tag: "Sport adapté",
    tagColor: "bg-accent/20 text-accent",
  },
  {
    time: "15:30",
    title: "Tables rondes : Sport & Inclusion",
    description:
      "Débats avec des athlètes, éducateurs et experts du secteur médico-social.",
    location: "Salle conférence",
    tag: "Conférence",
    tagColor: "bg-teal/20 text-teal",
  },
  {
    time: "17:00",
    title: "Remise des prix",
    description: "Récompenses pour les associations et bénévoles de l'année.",
    location: "Scène principale",
    tag: "Cérémonie",
    tagColor: "bg-teal/20 text-teal",
  },
  {
    time: "17:30",
    title: "Clôture musicale",
    description:
      "Concert de clôture par des artistes locaux. Entrée libre et accessible.",
    location: "Scène principale",
    tag: "Animation",
    tagColor: "bg-accent/20 text-accent",
  },
];

export default function ProgrammePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Journée du 14 juin 2025
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Programme
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Une journée riche en découvertes, émotions et rencontres. Tout est
          gratuit et accessible.
        </p>
      </header>

      <section aria-label="Programme de la journée">
        <ol className="relative border-l-2 border-teal/30 space-y-0" role="list">
          {schedule.map((activity, index) => (
            <li key={index} className="ml-6 pb-10 last:pb-0">
              <span
                className="absolute -left-[9px] flex items-center justify-center w-4 h-4 bg-teal rounded-full ring-4 ring-navy"
                aria-hidden="true"
              />
              <article
                className="bg-navy-light rounded-xl p-5 border border-teal/10 hover:border-teal/30 transition-colors ml-2"
                aria-labelledby={`activity-${index}`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <time
                    className="text-teal font-mono font-bold text-lg"
                    dateTime={`2025-06-14T${activity.time}`}
                  >
                    {activity.time}
                  </time>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activity.tagColor}`}
                  >
                    {activity.tag}
                  </span>
                </div>
                <h2
                  id={`activity-${index}`}
                  className="text-white font-semibold text-lg mb-1"
                >
                  {activity.title}
                </h2>
                <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-gray-500 text-xs">
                  <span aria-label="Lieu">📍</span> {activity.location}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
