import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "À propos" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Contact" },
  { href: "/don", label: "Faire un don" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-navy-dark border-t border-teal/20 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-bold text-lg text-white mb-2">
              Soli<span className="text-accent">mouv</span>
              <span className="text-teal">&apos;</span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Le festival du sport inclusif porté par{" "}
              <span className="text-teal">Up Sport! Paris</span>.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation secondaire">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-teal mb-3">
              Navigation
            </h2>
            <ul className="space-y-2" role="list">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-teal text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact rapide */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-teal mb-3">
              Contact
            </h2>
            <address className="not-italic text-gray-400 text-sm space-y-1">
              <p>Up Sport! Paris</p>
              <p>
                <a
                  href="mailto:contact@upsport-paris.fr"
                  className="hover:text-teal transition-colors"
                  aria-label="Envoyer un email à Up Sport! Paris"
                >
                  contact@upsport-paris.fr
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {year} Up Sport! Paris — Festival Solimouv&apos;. Tous droits
            réservés.
          </p>
          <p>
            Fait avec{" "}
            <span aria-label="amour" role="img">
              ♥
            </span>{" "}
            pour le sport inclusif
          </p>
        </div>
      </div>
    </footer>
  );
}
