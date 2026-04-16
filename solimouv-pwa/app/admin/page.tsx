import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration",
    description: "Tableau de bord administrateur du festival Solimouv'.",
    robots: { index: false, follow: false },
  };
}

const stats = [
  { label: "Inscrits", value: "0", color: "text-teal", icon: "👥" },
  { label: "Dons reçus", value: "0 €", color: "text-accent", icon: "❤" },
  { label: "Associations", value: "0", color: "text-teal", icon: "🏛" },
  { label: "Messages", value: "0", color: "text-accent", icon: "✉" },
];

const sections = [
  {
    title: "Gestion du programme",
    description: "Ajouter, modifier ou supprimer des créneaux du programme.",
    action: "Gérer le programme",
    href: "#programme",
  },
  {
    title: "Associations partenaires",
    description: "Valider les inscriptions et gérer les fiches associations.",
    action: "Gérer les associations",
    href: "#associations",
  },
  {
    title: "Dons & finances",
    description: "Consulter les dons reçus et exporter les données.",
    action: "Voir les dons",
    href: "#dons",
  },
  {
    title: "Messages contact",
    description: "Lire et répondre aux messages du formulaire de contact.",
    action: "Voir les messages",
    href: "#messages",
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-2">
          Espace réservé
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Administration
        </h1>
        <p className="text-gray-400 mt-1">Festival Solimouv&apos; — Up Sport! Paris</p>
      </header>

      {/* Stats */}
      <section aria-labelledby="stats-heading" className="mb-10">
        <h2 id="stats-heading" className="sr-only">
          Statistiques générales
        </h2>
        <ul
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          role="list"
        >
          {stats.map(({ label, value, color, icon }) => (
            <li
              key={label}
              className="bg-navy-light rounded-xl p-5 border border-teal/10 text-center"
            >
              <span
                className="text-3xl mb-2 block"
                role="img"
                aria-label={label}
              >
                {icon}
              </span>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-1">{label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Gestion */}
      <section aria-labelledby="management-heading">
        <h2
          id="management-heading"
          className="text-xl font-bold text-white mb-6"
        >
          Outils de gestion
        </h2>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          role="list"
        >
          {sections.map(({ title, description, action, href }) => (
            <li
              key={title}
              className="bg-navy-light rounded-xl p-6 border border-teal/10 hover:border-teal/30 transition-colors flex flex-col"
            >
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-1">{description}</p>
              <a
                href={href}
                className="inline-flex items-center text-teal text-sm font-medium hover:underline"
                aria-label={action}
              >
                {action}{" "}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Auth notice */}
      <aside
        className="mt-10 p-4 rounded-xl border border-accent/30 bg-accent/5 text-sm text-gray-400"
        role="note"
        aria-label="Note de sécurité"
      >
        <p>
          <strong className="text-accent">🔒 Accès protégé</strong> — Cette
          page sera protégée par authentification Supabase Auth (magic link).
          En production, seuls les administrateurs habilités pourront y accéder.
        </p>
      </aside>
    </div>
  );
}
