import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

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
    <div className="app-page">
      <div className="app-page__container app-grid">
        <PageHero
          eyebrow="Jour J · 14 juin 2025"
          title="Programme du festival"
          description="Le parcours est pense pour etre simple: tu arrives, tu reperes les temps forts, puis tu rejoins les zones qui t'interessent sans te perdre."
          actions={[
            { href: "/passeport", label: "Creer mon passeport" },
            { href: "/contact", label: "Poser une question", variant: "secondary" },
          ]}
        />

        <section className="app-card" data-reveal aria-label="Repères rapides">
          <div className="app-card__content">
            <div className="app-statbar stagger-list">
              {[
                ["10+", "temps forts"],
                ["100%", "accessible"],
                ["3", "zones majeures"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className="app-stat"
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-stat__value">{value}</span>
                  <span className="app-stat__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card" aria-label="Programme de la journée" data-reveal>
          <div className="app-card__content">
            <div className="timeline stagger-list" role="list">
              {schedule.map((activity, index) => (
                <article
                  key={activity.time + activity.title}
                  className="timeline-item"
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                  aria-labelledby={`activity-${index}`}
                >
                  <time
                    className="timeline-time"
                    dateTime={`2025-06-14T${activity.time}`}
                  >
                    {activity.time}
                  </time>
                  <div className="timeline-card">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="app-pill">{activity.tag}</span>
                      <span className="text-sm text-white/55">{activity.location}</span>
                    </div>
                    <h2 id={`activity-${index}`} className="timeline-card__title">
                      {activity.title}
                    </h2>
                    <p className="timeline-card__copy">{activity.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card app-card--soft" data-reveal>
          <div className="app-card__content flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="app-hero__eyebrow">Suite du parcours</p>
              <h2 className="text-2xl font-extrabold text-white m-0">Passe au Soli&apos;Passeport</h2>
              <p className="app-hero__description max-w-none">
                Une fois le programme repere, tu peux commencer a scanner les stands et garder une trace de ton aventure.
              </p>
            </div>
            <Link href="/passeport" className="app-button app-button--primary">
              Ouvrir mon pass
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
