import type { Metadata } from "next";
import Link from "next/link";
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
          title="Parlons de ton projet"
          description="Tu peux nous contacter pour une question rapide, un partenariat, une proposition de defi ou un besoin d'accompagnement. L'objectif est de ne jamais te bloquer dans ton parcours."
          actions={[
            { href: "/programme", label: "Voir le programme" },
            { href: "/associations", label: "Voir les associations", variant: "secondary" },
          ]}
        />

        <section className="app-card app-card--soft" data-reveal aria-label="Entrees de contact">
          <div className="app-card__content">
            <div className="defis-hero__layout">
              <div className="defis-hero__copy">
                <p className="app-hero__eyebrow">Contact direct</p>
                <h2 className="section-title">Parler avec nous ou proposer un defi</h2>
                <p className="app-hero__description">
                  On a organise la page pour trois usages concrets: poser une question, proposer
                  un defi mensuel, ou soutenir le projet.
                </p>
              </div>

              <div className="defis-hero__art" aria-hidden="true">
                <div className="defis-orbit defis-orbit--one" />
                <div className="defis-orbit defis-orbit--two" />
                <div className="defis-sticker defis-sticker--yellow">TALK</div>
                <div className="defis-sticker defis-sticker--lilac">IDEAS</div>
                <div className="defis-panel">
                  <span className="app-pill">Contact Solimouv</span>
                  <strong>On te repond</strong>
                  <p>Que ce soit pour parler, aider ou proposer un defi, tu tombes au bon endroit.</p>
                </div>
              </div>
            </div>

            <div className="highlights-grid stagger-list mt-5">
              {[
                {
                  title: "Parler avec nous",
                  copy: "Pour une question rapide, un besoin d&apos;orientation ou un accompagnement.",
                  cta: { href: "mailto:contact@upsport-paris.fr", label: "Nous ecrire" },
                  tone: "defis-card--lilac",
                },
                {
                  title: "Proposer un defi",
                  copy: "Pour soumettre une idee de challenge mensuel en lien avec le festival ou Soli'Skills.",
                  cta: { href: "#form-heading", label: "Proposer mon defi" },
                  tone: "defis-card--yellow",
                },
                {
                  title: "Soutenir Solimouv",
                  copy: "Pour soutenir les activites inclusives et orienter quelqu&apos;un vers la cagnotte.",
                  cta: { href: "/don", label: "Voir la cagnotte" },
                  tone: "defis-card--teal",
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className={`highlight-card ${item.tone}`}
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill">Contact</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  {item.cta.href.startsWith("mailto:") ? (
                    <a href={item.cta.href} className="app-button app-button--secondary mt-4">
                      {item.cta.label}
                    </a>
                  ) : (
                    <Link href={item.cta.href} className="app-button app-button--secondary mt-4">
                      {item.cta.label}
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

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
                Envoyer un message ou proposer un defi
              </h2>
              <p className="app-hero__description mb-5 max-w-none">
                Tu peux utiliser ce formulaire pour parler avec l&apos;equipe, proposer un partenariat,
                suggérer un defi, ou demander de l&apos;aide sur le parcours.
              </p>
              <ContactForm />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
