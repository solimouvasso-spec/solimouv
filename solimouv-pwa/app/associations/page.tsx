import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

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
    <div className="app-page">
      <div className="app-page__container app-grid">
        <PageHero
          eyebrow="Partenaires 2025"
          title="Les associations a rencontrer"
          description="Cette page te sert de repere avant et pendant le festival: tu identifies les structures qui t'interessent, puis tu poursuis ton parcours sur place."
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/contact", label: "Rejoindre le festival", variant: "secondary" },
          ]}
        />

        <section className="app-card" data-reveal>
          <div className="app-card__content">
            <div
              className="association-grid stagger-list"
              role="list"
              aria-label="Liste des associations partenaires"
            >
              {associations.map((asso, index) => (
                <article
                  key={asso.name}
                  className="association-card"
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill mb-3">{asso.sport}</span>
                  <h2>{asso.name}</h2>
                  <p className="mb-4">{asso.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {asso.tags.map((tag) => (
                      <span key={tag} className="app-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`mailto:${asso.contact}`}
                    className="app-button app-button--secondary"
                    aria-label={`Contacter ${asso.name} par email`}
                  >
                    {asso.contact}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card app-card--soft" data-reveal>
          <div className="app-card__content flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="app-hero__eyebrow">Prochaine etape</p>
              <h2 className="text-2xl font-extrabold text-white m-0">Passe du reperage a l&apos;action</h2>
              <p className="app-hero__description max-w-none">
                Une fois les associations reperees, cree ton passeport pour suivre tes rencontres et tes scans.
              </p>
            </div>
            <Link href="/passeport" className="app-button app-button--primary">
              Continuer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
