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

const SIGNUP_ROUTE = "/auth?mode=password&signup=1&redirect=/passeport";

export default function HomePage() {
  return (
    <div className="soli-page">
      <section className="hero">
        <div className="soli-container">
          <header className="soli-topbar" data-reveal>
            <LogoMark />
            <Link href={SIGNUP_ROUTE} className="soli-cta">
              Participer
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

            <Link href={SIGNUP_ROUTE} className="soli-cta hero-main-cta" data-reveal>
              Participer
            </Link>
          </div>
        </div>
      </section>

      <section className="app-page !py-0">
        <div className="app-page__container">
          <div className="app-card app-card--soft" data-reveal>
            <div className="app-card__content">
              <div className="journey-grid stagger-list">
                {[
                  ["1", "Je decouvre", "Je consulte le programme et les associations presentes."],
                  ["2", "Je participe", "Je cree mon passeport puis je scanne les stands pendant le festival."],
                  ["3", "Je continue", "Je garde le lien avec Solimouv via les defis et prochains rendez-vous."],
                ].map(([index, title, copy], idx) => (
                  <div
                    key={title}
                    className="journey-step"
                    data-reveal
                    style={{ ["--stagger-index" as string]: idx }}
                  >
                    <span className="journey-step__index">{index}</span>
                    <h2 className="journey-step__title">{title}</h2>
                    <p className="journey-step__copy">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
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

          <Link href="/defis" className="soli-cta skills-button" data-reveal>
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
              <Link href={SIGNUP_ROUTE} className="soli-cta subscribe-button">
                Participer
              </Link>
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
