"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/",           label: "Accueil" },
  { href: "/programme",  label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/defis",      label: "Défis" },
  { href: "/classement", label: "Classement" },
  { href: "/quiz",       label: "Quiz" },
  { href: "/don",        label: "Faire un don" },
  { href: "/contact",    label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

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
            className="flex items-center gap-2 font-bold text-xl text-white shrink-0"
            aria-label="Solimouv' — retour à l'accueil"
          >
            <span className="text-teal text-2xl" aria-hidden="true">◆</span>
            <span>
              Soli<span className="text-accent">mouv</span>
              <span className="text-teal">&apos;</span>
            </span>
          </Link>

          {/* Passeport CTA — toujours visible */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/passeport"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                pathname === "/passeport"
                  ? "bg-teal/20 text-teal"
                  : "bg-teal/10 text-teal hover:bg-teal/20"
              }`}
              aria-label="Mon Soli'Passeport"
              aria-current={pathname === "/passeport" ? "page" : undefined}
            >
              <span aria-hidden="true">🎟</span>
              <span>Mon passeport</span>
            </Link>
            {isAdmin ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    pathname === "/admin"
                      ? "bg-accent/20 text-accent"
                      : "text-accent hover:bg-accent/10"
                  }`}
                  aria-label="Administration"
                  aria-current={pathname === "/admin" ? "page" : undefined}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors rounded-full hover:bg-white/5"
                  aria-label="Se déconnecter"
                >
                  ⏻
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-gray-300 transition-colors hover:bg-white/5"
                aria-label="Connexion administration"
              >
                Admin
              </Link>
            )}
          </div>

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

          {/* Mobile : Scanner rapide + menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/scan"
              className="p-2 rounded-md text-teal hover:bg-teal/10 transition-colors"
              aria-label="Scanner un QR code"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3m0 0V1m0 2v2M3 9h2M1 3h2M3 19a2 2 0 002 2h3m0 0v2m0-2v-2M9 21h2M21 3h-3m0 0V1m0 2v2m3 4h-2m2 6h-2m-3 6v2m0-2v-2M19 21h-2M21 9a2 2 0 01-2-2V5m0 0H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9"
                />
              </svg>
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-gray-300 hover:text-teal hover:bg-white/5 transition-colors"
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
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-label="Menu de navigation mobile"
          >
            {/* Passeport & Scan en haut */}
            <div className="pb-2 pt-1 flex gap-2">
              <Link
                href="/passeport"
                onClick={() => setMenuOpen(false)}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pathname === "/passeport"
                    ? "bg-teal text-navy"
                    : "bg-teal/10 text-teal hover:bg-teal/20"
                }`}
                aria-current={pathname === "/passeport" ? "page" : undefined}
              >
                🎟 Mon passeport
              </Link>
              <Link
                href="/scan"
                onClick={() => setMenuOpen(false)}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pathname === "/scan"
                    ? "bg-accent text-white"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                }`}
                aria-current={pathname === "/scan" ? "page" : undefined}
              >
                📷 Scanner
              </Link>
            </div>

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
