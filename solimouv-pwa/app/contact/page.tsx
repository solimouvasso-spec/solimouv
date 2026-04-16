import type { Metadata } from "next";
import ContactForm from "./ContactForm";

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

      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="text-2xl font-bold text-white mb-6">
          Envoyer un message
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
