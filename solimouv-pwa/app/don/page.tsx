import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Faire un don",
    description:
      "Soutenez Up Sport! Paris et le festival Solimouv' en faisant un don. Votre contribution finance des équipements adaptés et des activités gratuites.",
  };
}

const tiers = [
  {
    amount: 10,
    label: "Solidaire",
    description: "Finance une heure d'atelier pour un enfant",
    color: "border-gray-600",
  },
  {
    amount: 30,
    label: "Engagé",
    description: "Contribue à l'achat d'un équipement adapté",
    color: "border-teal",
    featured: true,
  },
  {
    amount: 60,
    label: "Champion",
    description: "Sponsor une journée d'initiation pour un groupe",
    color: "border-accent",
  },
  {
    amount: 150,
    label: "Partenaire",
    description: "Permet d'animer un atelier lors du festival",
    color: "border-gray-600",
  },
];

export default function DonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Agir concrètement
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Faire un don
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Chaque euro donné soutient directement des pratiquants et des
          associations qui œuvrent pour un sport plus inclusif.
        </p>
      </header>

      {/* Impact */}
      <section aria-labelledby="impact-heading" className="mb-12">
        <h2
          id="impact-heading"
          className="text-2xl font-bold text-white mb-6 text-center"
        >
          Votre impact
        </h2>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          role="list"
        >
          {tiers.map(({ amount, label, description, color, featured }) => (
            <li key={amount}>
              <button
                type="button"
                className={`w-full text-left p-5 rounded-2xl border-2 ${color} ${
                  featured ? "bg-teal/10 ring-1 ring-teal/30" : "bg-navy-light"
                } hover:opacity-90 transition-all focus-visible:ring-2 focus-visible:ring-teal`}
                aria-label={`Donner ${amount}€ — ${label} — ${description}`}
              >
                {featured && (
                  <span className="text-xs font-semibold text-teal uppercase tracking-widest block mb-2">
                    Populaire
                  </span>
                )}
                <p className="text-3xl font-extrabold text-white mb-1">
                  {amount}€
                </p>
                <p className="text-teal font-semibold text-sm mb-2">{label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {description}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulaire de don */}
      <section
        aria-labelledby="don-form-heading"
        className="bg-navy-light rounded-2xl p-6 sm:p-8 border border-teal/20"
      >
        <h2
          id="don-form-heading"
          className="text-2xl font-bold text-white mb-6"
        >
          Personnaliser votre don
        </h2>
        <form
          className="space-y-5"
          aria-label="Formulaire de don"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="don-prenom"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Prénom <span aria-hidden="true" className="text-accent">*</span>
              </label>
              <input
                id="don-prenom"
                type="text"
                name="prenom"
                required
                autoComplete="given-name"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Marie"
              />
            </div>
            <div>
              <label
                htmlFor="don-nom"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Nom <span aria-hidden="true" className="text-accent">*</span>
              </label>
              <input
                id="don-nom"
                type="text"
                name="nom"
                required
                autoComplete="family-name"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="don-email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email <span aria-hidden="true" className="text-accent">*</span>
            </label>
            <input
              id="don-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              aria-required="true"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              placeholder="marie@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="don-montant"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Montant (€){" "}
              <span aria-hidden="true" className="text-accent">*</span>
            </label>
            <input
              id="don-montant"
              type="number"
              name="montant"
              required
              min={1}
              step={1}
              aria-required="true"
              aria-describedby="don-montant-hint"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              placeholder="30"
            />
            <p id="don-montant-hint" className="text-gray-500 text-xs mt-1">
              Minimum 1€
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="don-recu"
              type="checkbox"
              name="recu_fiscal"
              className="mt-0.5 accent-teal rounded w-5 h-5 shrink-0"
              aria-label="Recevoir un reçu fiscal par email"
            />
            <label htmlFor="don-recu" className="text-gray-300 text-sm cursor-pointer">
              Je souhaite recevoir un reçu fiscal (pour déduction d&apos;impôts,
              dons admissibles à 66% de réduction)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-accent text-white font-bold text-lg rounded-full hover:bg-accent/90 transition-colors"
            aria-label="Finaliser mon don"
          >
            Faire mon don ❤
          </button>
        </form>
      </section>
    </div>
  );
}
