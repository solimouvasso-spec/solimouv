import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import PageHero from "@/components/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "Contactez l'équipe organisatrice du festival Solimouv' pour toute question, partenariat ou bénévolat.",
  };
}

export default function ContactPage() {
  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <PageHero
          eyebrow="Support & organisation"
          title="Une page d'aide claire"
          description="Tu peux nous contacter pour une question rapide, un partenariat ou un besoin d'accompagnement. L'objectif est de ne jamais te bloquer dans ton parcours."
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/associations", label: "Voir les associations", variant: "secondary" },
          ]}
        />

        <section className="support-grid" aria-label="Contact et formulaire">
          <div className="app-card app-card--soft" data-reveal>
            <div className="app-card__content">
              <p className="app-hero__eyebrow">Acces rapide</p>
              <div className="contact-list stagger-list">
                {[
                  {
                    icon: "@",
                    label: "Email",
                    value: "contact@upsport-paris.fr",
                    href: "mailto:contact@upsport-paris.fr",
                  },
                  {
                    icon: "+",
                    label: "Telephone",
                    value: "+33 1 23 45 67 89",
                    href: "tel:+33123456789",
                  },
                  {
                    icon: "#",
                    label: "Lieu",
                    value: "Paris, Ile-de-France",
                  },
                ].map(({ icon, label, value, href }, index) => (
                  <div
                    key={label}
                    className="contact-row"
                    data-reveal
                    style={{ ["--stagger-index" as string]: index }}
                  >
                    <span className="contact-row__icon" aria-hidden="true">
                      {icon}
                    </span>
                    <div>
                      <span className="contact-row__label">{label}</span>
                      {href ? (
                        <a href={href} className="contact-row__value">
                          {value}
                        </a>
                      ) : (
                        <p className="contact-row__value m-0">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="app-card" aria-labelledby="form-heading" data-reveal>
            <div className="app-card__content">
              <h2 id="form-heading" className="text-2xl font-extrabold text-white mt-0 mb-4">
                Envoyer un message
              </h2>
              <ContactForm />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
