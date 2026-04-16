import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solimouv' — Festival du sport inclusif",
  description:
    "Découvrez Solimouv', le festival parisien qui célèbre le sport pour tous. Activités adaptées, associations, concerts et bien plus.",
};

const FEATURES = [
  {
    icon: "🏅",
    title: "Sports adaptés",
    description: "Plus de 20 disciplines sportives accessibles à tous les niveaux et toutes les situations de handicap.",
    color: "from-teal/20 to-teal/5",
    border: "border-teal/20",
    glow: "group-hover:glow-teal-sm",
  },
  {
    icon: "🎟",
    title: "Soli'Passeport",
    description: "Scanne les stands, débloque des badges, accumule des points et gagne des récompenses tout au long de l'année.",
    color: "from-accent/20 to-accent/5",
    border: "border-accent/20",
    glow: "group-hover:glow-accent",
  },
  {
    icon: "🤝",
    title: "Associations",
    description: "Rencontrez 30+ associations locales qui œuvrent chaque jour pour un sport plus inclusif.",
    color: "from-teal/20 to-teal/5",
    border: "border-teal/20",
    glow: "",
  },
  {
    icon: "🎯",
    title: "Défis mensuels",
    description: "Participez aux défis proposés par les associations tout au long de l'année et restez en mouvement.",
    color: "from-accent/20 to-accent/5",
    border: "border-accent/20",
    glow: "",
  },
];

const STATS = [
  { value: "30+",  label: "Associations",  icon: "🏛" },
  { value: "20+",  label: "Sports",        icon: "⚡" },
  { value: "500+", label: "Participants",  icon: "👥" },
  { value: "14",   label: "Juin 2025",     icon: "📅" },
];

const BADGES_PREVIEW = ["🔍", "♿", "🤝", "🧘", "🏆"];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy-dark"
      >
        {/* Blobs animés */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="animate-blob absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #00C9A7 0%, transparent 70%)", animationDelay: "0s" }}
          />
          <div
            className="animate-blob absolute -bottom-40 right-0 w-[700px] h-[700px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #E63946 0%, transparent 65%)", animationDelay: "3s" }}
          />
          <div
            className="animate-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #00C9A7 0%, transparent 60%)", animationDelay: "6s" }}
          />
          {/* Grille subtile */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(0,201,167,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,167,.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" aria-hidden="true" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">
                Festival du sport inclusif · 14 juin 2025 · Paris
              </span>
            </div>

            {/* Titre */}
            <h1
              id="hero-heading"
              className="animate-fade-up delay-100 text-6xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none tracking-tight"
            >
              <span className="text-gradient-hero">Soli</span>
              <span className="text-accent" style={{ WebkitTextFillColor: "#E63946" }}>mouv</span>
              <span className="text-gradient-teal" style={{ fontSize: "0.7em" }}>&apos;</span>
            </h1>

            {/* Sous-titre */}
            <p className="animate-fade-up delay-200 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Le sport pour{" "}
              <strong className="text-white font-bold">tous</strong>, célébré
              ensemble. Une journée d&apos;inclusion, de rencontres et de mouvement.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/passeport"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
                aria-label="Créer mon Soli'Passeport"
              >
                <span className="relative z-10 text-navy">🎟 Créer mon passeport</span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #00f0cc, #00C9A7)" }}
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/programme"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg border-2 border-teal/40 text-teal hover:border-teal hover:bg-teal/10 transition-all duration-300 hover:scale-105"
                aria-label="Voir le programme du festival"
              >
                Voir le programme →
              </Link>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
              role="list"
              aria-label="Chiffres clés du festival"
            >
              {STATS.map(({ value, label, icon }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-4 text-center hover-lift"
                  role="listitem"
                >
                  <span className="text-2xl block mb-1" role="img" aria-label={label}>{icon}</span>
                  <p className="text-2xl font-extrabold text-gradient-teal">{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-slow opacity-40"
          aria-hidden="true"
        >
          <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── PASSEPORT PROMO ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="passeport-promo-heading"
        className="relative overflow-hidden py-20 sm:py-28"
        style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #07111a 50%, #0D1B2A 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #00C9A7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div>
              <span className="inline-block text-teal text-xs font-semibold uppercase tracking-widest mb-4 glass rounded-full px-3 py-1">
                Nouveauté 2025
              </span>
              <h2
                id="passeport-promo-heading"
                className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight"
              >
                Le{" "}
                <span className="text-gradient-teal">Soli&apos;Passeport</span>
                {" "}numérique
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Scanne les QR codes aux stands du festival, débloque des badges
                inclusifs et accumule des points toute l&apos;année grâce aux
                défis mensuels. Les meilleurs gagnent des récompenses exceptionnelles !
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/passeport"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-navy transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
                  aria-label="Créer mon Soli'Passeport"
                >
                  🎟 Créer mon passeport
                </Link>
                <Link
                  href="/classement"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold border border-teal/30 text-teal hover:bg-teal/10 transition-all"
                  aria-label="Voir le classement"
                >
                  Voir le classement →
                </Link>
              </div>
            </div>

            {/* Carte passeport visuelle */}
            <div className="relative">
              {/* Glow derrière la carte */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, #00C9A7, transparent)" }}
                aria-hidden="true"
              />
              <div className="relative glass-card rounded-3xl p-6 sm:p-8 border-gradient-teal">
                {/* Header carte */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-1">Soli&apos;Passeport · 2025</p>
                    <p className="text-white font-extrabold text-2xl">Ton prénom</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-extrabold text-gradient-teal">0</p>
                    <p className="text-gray-600 text-xs">points</p>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>0/10 stands</span>
                    <span>5 pour le lot 🎁</span>
                  </div>
                  <div className="h-2.5 bg-navy-dark rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full w-0"
                      style={{ background: "linear-gradient(90deg, #00C9A7, #00f0cc)" }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <p className="text-gray-500 text-xs mb-3">Badges à débloquer</p>
                  <div className="flex gap-2">
                    {BADGES_PREVIEW.map((icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl bg-navy-dark border border-gray-700/50 flex items-center justify-center opacity-30"
                        aria-hidden="true"
                      >
                        <span className="text-lg grayscale">🔒</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="features-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <div className="text-center mb-16">
          <h2
            id="features-heading"
            className="text-3xl sm:text-5xl font-extrabold text-white mb-4"
          >
            Qu&apos;est-ce qui vous attend ?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Un festival pensé pour que chacun trouve sa place et vive une
            expérience unique.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
        >
          {FEATURES.map(({ icon, title, description, color, border }) => (
            <li
              key={title}
              className={`group glass-card rounded-2xl p-6 border hover-lift transition-all cursor-default ${border}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300`}
                aria-hidden="true"
              >
                <span className="text-3xl">{icon}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── QUIZ CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="quiz-cta-heading"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,201,167,.08) 0%, rgba(0,201,167,.03) 100%)" }}
      >
        <div className="absolute inset-0 border-y border-teal/15 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="text-5xl block mb-5 animate-float" role="img" aria-label="Quiz">🎯</span>
          <h2 id="quiz-cta-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pas sûr(e) de quel sport vous correspond ?
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">
            Faites notre quiz de 2 minutes et découvrez l&apos;activité faite pour vous.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-navy text-lg transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
            aria-label="Commencer le quiz sport inclusif"
          >
            Commencer le quiz →
          </Link>
        </div>
      </section>

      {/* ── DON CTA ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="don-cta-heading"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <div className="glass-card rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: "radial-gradient(circle at 70% 30%, #E63946, transparent 60%)" }}
            aria-hidden="true"
          />
          <span className="text-5xl block mb-5 animate-float-slow" role="img" aria-label="Cœur">❤</span>
          <h2 id="don-cta-heading" className="text-3xl font-extrabold text-white mb-4 relative">
            Soutenez le sport inclusif
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto relative">
            Votre don permet à Up Sport! Paris de financer des équipements
            adaptés et des activités gratuites pour tous.
          </p>
          <Link
            href="/don"
            className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white text-lg border-2 border-accent hover:bg-accent/20 transition-all hover:scale-105"
            aria-label="Faire un don à Up Sport Paris"
          >
            Faire un don ❤
          </Link>
        </div>
      </section>
    </>
  );
}
