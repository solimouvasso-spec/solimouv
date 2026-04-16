import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "Contactez l'équipe organisatrice du festival Solimouv' pour toute question, partenariat ou bénévolat.",
  };
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Nous écrire
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Contact
        </h1>
        <p className="text-gray-400 text-lg">
          Questions, partenariats, bénévolat — nous sommes à votre écoute.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: "📧",
            label: "Email",
            value: "contact@upsport-paris.fr",
            href: "mailto:contact@upsport-paris.fr",
          },
          {
            icon: "📞",
            label: "Téléphone",
            value: "+33 1 23 45 67 89",
            href: "tel:+33123456789",
          },
          {
            icon: "📍",
            label: "Adresse",
            value: "Paris, Île-de-France",
            href: undefined,
          },
        ].map(({ icon, label, value, href }) => (
          <div
            key={label}
            className="bg-navy-light rounded-xl p-5 border border-teal/10 text-center"
          >
            <span className="text-3xl mb-2 block" role="img" aria-label={label}>
              {icon}
            </span>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
              {label}
            </p>
            {href ? (
              <a
                href={href}
                className="text-teal text-sm hover:underline"
                aria-label={`${label} : ${value}`}
              >
                {value}
              </a>
            ) : (
              <p className="text-gray-300 text-sm">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire de contact */}
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="text-2xl font-bold text-white mb-6">
          Envoyer un message
        </h2>
        <form
          className="space-y-5"
          aria-label="Formulaire de contact"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Nom complet <span aria-hidden="true" className="text-accent">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Marie Dupont"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email <span aria-hidden="true" className="text-accent">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                aria-required="true"
                className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="marie@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Sujet
            </label>
            <select
              id="contact-subject"
              name="subject"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              aria-label="Sélectionner un sujet"
            >
              <option value="">Choisir un sujet...</option>
              <option value="info">Information générale</option>
              <option value="partnership">Partenariat</option>
              <option value="volunteer">Bénévolat</option>
              <option value="association">Inscription association</option>
              <option value="press">Presse</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Message <span aria-hidden="true" className="text-accent">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              aria-required="true"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none"
              placeholder="Votre message..."
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors"
            aria-label="Envoyer le formulaire de contact"
          >
            Envoyer le message
          </button>
        </form>
      </section>
    </div>
  );
}
