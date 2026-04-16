import Link from "next/link";

const NAV_LINKS = [
  { href: "/programme",  label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/defis",      label: "Défis mensuels" },
  { href: "/classement", label: "Classement" },
  { href: "/about",      label: "À propos" },
  { href: "/contact",    label: "Contact" },
];

const GAME_LINKS = [
  { href: "/passeport", label: "Mon passeport 🎟" },
  { href: "/scan",      label: "Scanner un stand 📷" },
  { href: "/quiz",      label: "Quiz sport inclusif 🎯" },
  { href: "/don",       label: "Faire un don ❤" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="relative overflow-hidden mt-auto">
      {/* Ligne séparatrice avec glow */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,201,167,.4), transparent)" }}
        aria-hidden="true"
      />

      <div
        style={{
          background: "linear-gradient(180deg, rgba(7,17,26,.98) 0%, #07111a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-extrabold text-2xl text-white mb-4 block"
                aria-label="Retour à l'accueil Solimouv'"
              >
                <span className="text-teal" aria-hidden="true">◆</span>
                Soli<span className="text-accent">mouv</span>
                <span className="text-teal">&apos;</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Le festival du sport inclusif porté par{" "}
                <span className="text-teal font-semibold">Up Sport! Paris</span>.
                Une journée pour tous, célébrée ensemble.
              </p>
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" aria-hidden="true" />
                <span className="text-teal text-xs font-semibold">14 juin 2025 · Paris</span>
              </div>
            </div>

            {/* Navigation */}
            <nav aria-label="Navigation secondaire">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal mb-4">
                Festival
              </h2>
              <ul className="space-y-2.5" role="list">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gray-500 hover:text-teal text-sm transition-colors hover:translate-x-1 inline-block duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Passeport */}
            <nav aria-label="Soli'Passeport">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                Soli&apos;Passeport
              </h2>
              <ul className="space-y-2.5" role="list">
                {GAME_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gray-500 hover:text-accent text-sm transition-colors hover:translate-x-1 inline-block duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal mb-4">
                Contact
              </h2>
              <address className="not-italic text-sm space-y-3">
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Association</p>
                  <p className="text-gray-400 font-medium">Up Sport! Paris</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Email</p>
                  <a
                    href="mailto:contact@upsport-paris.fr"
                    className="text-teal hover:text-teal/80 transition-colors"
                    aria-label="Envoyer un email à Up Sport! Paris"
                  >
                    contact@upsport-paris.fr
                  </a>
                </div>
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Lieu</p>
                  <p className="text-gray-400">Paris, Île-de-France</p>
                </div>
              </address>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700"
            style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}
          >
            <p>
              © {year} Up Sport! Paris — Festival Solimouv&apos;. Tous droits réservés.
            </p>
            <p className="flex items-center gap-1.5">
              Fait avec{" "}
              <span aria-label="amour" role="img" className="text-accent">♥</span>{" "}
              pour le sport inclusif
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
