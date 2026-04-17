import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import InteractiveFestivalMap from "@/app/programme/InteractiveFestivalMap";

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
  color: "teal" | "yellow" | "lilac";
};

type ZoneAccent = "teal" | "yellow" | "lilac";

const schedule: Activity[] = [
  {
    time: "09:00",
    title: "Ouverture du festival",
    description: "Accueil des visiteurs, mot d'ouverture par Up Sport! Paris.",
    location: "Scène principale",
    tag: "Cérémonie",
    color: "teal",
  },
  {
    time: "09:30",
    title: "Initiation au boccia",
    description:
      "Sport de précision accessible aux personnes en situation de handicap moteur sévère.",
    location: "Zone A",
    tag: "Sport adapté",
    color: "lilac",
  },
  {
    time: "10:00",
    title: "Démo : Basket fauteuil",
    description:
      "Démonstration par les champions de l'équipe de Paris. Initiation ouverte à tous.",
    location: "Terrain central",
    tag: "Démonstration",
    color: "teal",
  },
  {
    time: "11:00",
    title: "Atelier yoga inclusif",
    description:
      "Séance de yoga adaptée à tous les corps et toutes les capacités.",
    location: "Zone B",
    tag: "Atelier",
    color: "yellow",
  },
  {
    time: "12:00",
    title: "Pause déjeuner — Food trucks",
    description: "Restauration sur place avec des prestataires partenaires.",
    location: "Espace détente",
    tag: "Restauration",
    color: "lilac",
  },
  {
    time: "13:30",
    title: "Forum des associations",
    description:
      "Rencontrez 30 associations parisiennes spécialisées dans le sport inclusif.",
    location: "Hall principal",
    tag: "Forum",
    color: "teal",
  },
  {
    time: "14:30",
    title: "Initiation au goalball",
    description:
      "Sport paralympique pour personnes déficientes visuelles — jouez les yeux bandés !",
    location: "Zone C",
    tag: "Sport adapté",
    color: "yellow",
  },
  {
    time: "15:30",
    title: "Tables rondes : Sport & Inclusion",
    description:
      "Débats avec des athlètes, éducateurs et experts du secteur médico-social.",
    location: "Salle conférence",
    tag: "Conférence",
    color: "lilac",
  },
  {
    time: "17:00",
    title: "Remise des prix",
    description: "Récompenses pour les associations et bénévoles de l'année.",
    location: "Scène principale",
    tag: "Cérémonie",
    color: "yellow",
  },
  {
    time: "17:30",
    title: "Clôture musicale",
    description:
      "Concert de clôture par des artistes locaux. Entrée libre et accessible.",
    location: "Scène principale",
    tag: "Animation",
    color: "teal",
  },
  {
    time: "16:00",
    title: "Parcours moteur en duo",
    description:
      "Défi coopératif pour tester coordination, confiance et inclusion en binôme.",
    location: "Village défi",
    tag: "Challenge",
    color: "yellow",
  },
  {
    time: "16:30",
    title: "Rencontre athlètes & bénévoles",
    description:
      "Temps d'échange avec les équipes qui font vivre le festival toute l'année.",
    location: "Agora inclusive",
    tag: "Rencontre",
    color: "lilac",
  },
];

const mapZones: {
  id: string;
  name: string;
  label: string;
  description: string;
  accent: ZoneAccent;
  mapQuery: string;
  scans: string[];
}[] = [
  {
    id: "A",
    name: "Zone A",
    label: "Boccia & precision",
    description: "Premier spot a scanner si tu veux lancer ton passeport facilement.",
    accent: "yellow",
    mapQuery: "Grande Halle de la Villette Paris",
    scans: ["SCAN-001"],
  },
  {
    id: "B",
    name: "Zone B",
    label: "Yoga inclusif",
    description: "Ateliers doux et espace respiration avec QR code a l'entree.",
    accent: "lilac",
    mapQuery: "Cabaret Sauvage Paris",
    scans: [],
  },
  {
    id: "C",
    name: "Zone C",
    label: "Goalball",
    description: "Zone paralympique immersive avec demo et scan badge.",
    accent: "teal",
    mapQuery: "Cite des Sciences et de l'Industrie Paris",
    scans: [],
  },
  {
    id: "D",
    name: "Agora",
    label: "Rencontres & talks",
    description: "Tables rondes, discussions et orientation visiteurs.",
    accent: "yellow",
    mapQuery: "Le Trabendo Paris",
    scans: ["SCAN-022"],
  },
  {
    id: "E",
    name: "Village defi",
    label: "Defis Solimouv",
    description: "Le coin le plus vivant pour reclamer des badges et activer des mini-jeux.",
    accent: "lilac",
    mapQuery: "La Folie N5 Parc de la Villette Paris",
    scans: ["SCAN-031", "SCAN-014"],
  },
];

const scanSpots: {
  id: string;
  name: string;
  code: string;
  area: string;
  detail: string;
  zoneId: string;
  mapQuery: string;
}[] = [
  {
    id: "spot-accueil",
    name: "Accueil festival",
    code: "SCAN-001",
    area: "Entree principale",
    detail: "Ton premier QR code pour activer le pass et comprendre le parcours.",
    zoneId: "A",
    mapQuery: "Grande Halle de la Villette 211 Avenue Jean Jaures Paris",
  },
  {
    id: "spot-football",
    name: "Stand football",
    code: "SCAN-014",
    area: "Terrain central",
    detail: "Badge special + points bonus si tu completes le mini challenge.",
    zoneId: "E",
    mapQuery: "Prairie du Cercle Nord Parc de la Villette Paris",
  },
  {
    id: "spot-forum",
    name: "Forum associations",
    code: "SCAN-022",
    area: "Hall principal",
    detail: "Rencontre les associations et debloque une recompense reseau.",
    zoneId: "D",
    mapQuery: "Le Trabendo 211 Avenue Jean Jaures Paris",
  },
  {
    id: "spot-defi",
    name: "Village defi",
    code: "SCAN-031",
    area: "Espace engagement",
    detail: "Le meilleur spot pour enchaîner scan, activite et defi mensuel.",
    zoneId: "E",
    mapQuery: "La Folie N5 Parc de la Villette Paris",
  },
];

const festivalActivities: {
  title: string;
  copy: string;
  zone: string;
  accent: ZoneAccent;
  zoneId: string;
}[] = [
  {
    title: "Football inclusif",
    copy: "Badge a reclamer sur le terrain central avec initiation libre toutes les 30 minutes.",
    zone: "Terrain central",
    accent: "yellow",
    zoneId: "E",
  },
  {
    title: "Parcours duo",
    copy: "Activite cooperative pensee pour jouer a deux et creer des echanges.",
    zone: "Village defi",
    accent: "lilac",
    zoneId: "E",
  },
  {
    title: "Rencontres associations",
    copy: "Un hub pour discuter, trouver un club et repartir avec une suite concrete.",
    zone: "Forum",
    accent: "teal",
    zoneId: "D",
  },
];

export default function ProgrammePage() {
  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <PageHero
          eyebrow="Carte festival · 14 juin 2025"
          title="Carte interactive du festival"
          description="Tu reperes les zones, les QR codes a scanner et les temps forts sur une vraie carte, avec un panneau d'action pour savoir ou aller ensuite."
          actions={[
            { href: "/passeport", label: "Creer mon passeport" },
            { href: "/scan", label: "Scanner un code", variant: "secondary" },
          ]}
        />

        <InteractiveFestivalMap
          zones={mapZones}
          scanSpots={scanSpots}
          activities={festivalActivities}
          schedule={schedule}
        />

        <section className="app-card app-card--soft" data-reveal aria-label="Spots de scan">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Complement terrain</p>
              <h2 className="section-title">Les spots QR les plus utiles</h2>
            </div>

            <div className="scan-spot-grid stagger-list">
              {scanSpots.map((spot, index) => (
                <article
                  key={spot.code}
                  className="scan-spot-card"
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <div className="scan-spot-card__top">
                    <span className="scan-spot-card__code">{spot.code}</span>
                    <span className="app-pill">{spot.area}</span>
                  </div>
                  <h3>{spot.name}</h3>
                  <p>{spot.detail}</p>
                  <Link href="/scan" className="app-button app-button--secondary">
                    Activer le scanner
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card" aria-label="Activites du festival" data-reveal>
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Temps forts</p>
              <h2 className="section-title">Activites a ne pas manquer</h2>
            </div>

            <div className="festival-activity-grid stagger-list">
              {festivalActivities.map((activity, index) => (
                <article
                  key={activity.title}
                  className={`festival-activity-card festival-activity-card--${activity.accent}`}
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill">{activity.zone}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card" aria-label="Programme de la journée" data-reveal>
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Timeline</p>
              <h2 className="section-title">Le programme heure par heure</h2>
            </div>
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
                      <span className={`map-chip map-chip--${activity.color}`}>{activity.tag}</span>
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
