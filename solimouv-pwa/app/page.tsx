import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solimouv",
  description:
    "Le festival du sport inclusif ou chaque mouvement compte.",
};

function LogoMark() {
  return (
    <span className="soli-logo" aria-label="Solimouv">
      SOLI
      <br />
      MOUV
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="soli-page">
      <section className="hero">
        <div className="soli-container">
          <header className="soli-topbar" data-reveal>
            <LogoMark />
            <Link href="#subscribe" className="soli-cta">
              Voir l&apos;app
            </Link>
          </header>

          <div className="hero-grid">
            <div className="hero-floaters" aria-hidden="true" data-reveal>
              <div className="sticker hero-badge-left">✺</div>
              <div className="photo-card hero-card-left" />
              <div className="photo-card second hero-card-right" />
              <div className="sticker sticker-yellow hero-badge-right">❂</div>
            </div>

            <h1 className="soli-display hero-title" data-reveal>
              <span className="hero-line">Le festival du sport</span>
              <span className="hero-line">inclusif ou chaque</span>
              <span className="hero-line">mouvement compte</span>
            </h1>

            <p className="hero-subtitle" data-reveal>
              Solimouv festival chaque experience ouvre de nouveaux possible
            </p>

            <Link href="#subscribe" className="soli-cta hero-main-cta" data-reveal>
              Je m&apos;inscris
            </Link>
          </div>
        </div>
      </section>

      <section className="curve-section">
        <div className="intro-panel">
          <div className="soli-container">
            <h2 className="soli-display intro-title" data-reveal>
              Un festival,
              <br />
              un mouvement,
              <br />
              une vision !
            </h2>

            <div className="feature-photo" aria-hidden="true" data-reveal />

            <p className="intro-copy" data-reveal>
              Ici, le sport n&apos;est pas une performance, c&apos;est un langage commun, un
              espace de rencontre et une experience a vivre sans barriere.
              <br />
              Grace a ton soli&apos;passeport, decouvre des activites sportives accessibles a
              tous, rencontre des associations engagees et construis ton parcours unique au
              sein du festival.
            </p>
          </div>
        </div>
      </section>

      <section className="blue-band">
        <div className="soli-container blue-content">
          <h2 className="soli-display blue-title" data-reveal>
            Mais Solimouv ne s&apos;arrete pas au temps d&apos;un week-end.
          </h2>

          <p className="soli-display blue-copy" data-reveal>
            Grace a la plateforme Soli&apos;Skills, l&apos;experience continue tout au long de
            l&apos;annee a travers des defis, des rencontres et des engagements sportifs.
          </p>

          <Link href="#subscribe" className="soli-cta skills-button" data-reveal>
            Soli&apos;Skills
          </Link>

          <div className="sticker band-sticker" aria-hidden="true">
            ✺
          </div>
        </div>

        <div className="runner-photo" aria-hidden="true" data-reveal />
      </section>

      <section className="impact-panel">
        <div className="soli-container">
          <h2 className="soli-display impact-title" data-reveal>
            Le sport devient un levier d&apos;inclusion sociale.
          </h2>
        </div>
      </section>

      <footer className="footer-panel" id="subscribe">
        <div className="soli-container">
          <div className="footer-top" data-reveal>
            <LogoMark />

            <div className="subscribe-wrap">
              <label className="subscribe-label" htmlFor="email">
                Inscrit toi des maintenant
              </label>
              <input
                className="subscribe-input"
                id="email"
                type="email"
                placeholder="soli.mouv@solimouv.com"
              />
              <button className="soli-cta subscribe-button" type="button">
                Subscribe
              </button>
              <p className="subscribe-note">
                By subscribing you agree to our Privacy Policy
              </p>
            </div>
          </div>

          <div className="footer-wordmark" aria-label="Solimouv" data-reveal>
            SOLIMOUV
          </div>

          <div className="footer-rule" />

          <div className="footer-bottom" data-reveal>
            <nav className="footer-links" aria-label="Legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies Settings</a>
            </nav>
            <p>© 2026 SOLIMOUV. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
