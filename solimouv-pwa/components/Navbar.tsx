"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "/programme",    label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/defis",        label: "Défis" },
  { href: "/classement",   label: "Classement" },
  { href: "/don",          label: "Don" },
  { href: "/contact",      label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setIsAdmin(!!s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-purple-dark/95 backdrop-blur-md shadow-xl shadow-black/30"
          : "bg-purple-dark"
      }`}
      style={{ borderBottom: "1px solid rgba(245,200,0,.1)" }}
    >
      <nav
        aria-label="Navigation principale"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl shrink-0 group"
            aria-label="Solimouv' — retour à l'accueil"
          >
            <span
              className="display text-2xl text-gradient-yellow tracking-wider group-hover:animate-glow-yellow transition-all"
              aria-hidden="true"
            >
              SOLI<span className="text-white">MOUV</span>
              <span className="text-yellow" style={{ color: "#F5C800", WebkitTextFillColor: "#F5C800" }}>&apos;</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-0.5" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all ${
                      active
                        ? "text-yellow bg-yellow/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    style={active ? { color: "#F5C800" } : {}}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Passeport CTA */}
            <Link
              href="/passeport"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all hover:scale-105 ${
                pathname === "/passeport" ? "text-purple-dark" : "text-purple-dark"
              }`}
              style={{
                background: pathname === "/passeport"
                  ? "linear-gradient(135deg, #FFE066, #F5C800)"
                  : "linear-gradient(135deg, #F5C800, #e6b800)",
              }}
              aria-label="Mon Soli'Passeport"
              aria-current={pathname === "/passeport" ? "page" : undefined}
            >
              🎟 Passeport
            </Link>

            {/* Admin */}
            {isAdmin ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-lg text-xs font-semibold uppercase text-white/50 hover:text-white/80 transition-colors"
                  aria-current={pathname === "/admin" ? "page" : undefined}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label="Se déconnecter"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wide transition-colors"
                aria-label="Administration"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile : Scanner + burger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/scan"
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#F5C800" }}
              aria-label="Scanner un QR code"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1M4 12h1m14 0h1M6.34 6.34l.707.707M16.95 16.95l.707.707M6.34 17.66l.707-.707M16.95 7.05l.707-.707" />
              </svg>
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            aria-label="Menu mobile"
            className="pb-5 pt-2"
          >
            {/* CTAs mobile */}
            <div className="flex gap-2 mb-3">
              <Link
                href="/passeport"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-xl text-sm font-bold uppercase text-purple-dark transition-all"
                style={{ background: "linear-gradient(135deg, #F5C800, #e6b800)" }}
              >
                🎟 Mon passeport
              </Link>
              <Link
                href="/scan"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-3 rounded-xl text-sm font-bold uppercase text-purple-dark transition-all"
                style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
              >
                📷 Scanner
              </Link>
            </div>

            <ul className="space-y-0.5" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-colors ${
                        active
                          ? "bg-yellow/10 text-yellow"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                      style={active ? { color: "#F5C800" } : {}}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    Administration
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
