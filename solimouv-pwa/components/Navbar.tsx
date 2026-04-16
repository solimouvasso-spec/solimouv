"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/match", label: "Mon sport" },
  { href: "/quiz", label: "Quiz" },
  { href: "/don", label: "Faire un don" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-teal/20"
    >
      <nav
        aria-label="Navigation principale"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white"
            aria-label="Solimouv' — retour à l'accueil"
          >
            <span className="text-teal text-2xl" aria-hidden="true">
              ◆
            </span>
            <span>
              Soli<span className="text-accent">mouv</span>
              <span className="text-teal">&apos;</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-teal/20 text-teal"
                        : "text-gray-300 hover:text-teal hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-teal hover:bg-white/5 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" role="dialog" aria-label="Menu de navigation">
            <ul className="pb-4 space-y-1" role="list">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? "bg-teal/20 text-teal"
                          : "text-gray-300 hover:text-teal hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
