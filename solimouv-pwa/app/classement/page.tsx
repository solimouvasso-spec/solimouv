import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Classement — Soli'Passeport",
  description: "Classement annuel des participants du Soli'Passeport Solimouv'. Les 3 premiers gagnent des récompenses exceptionnelles !",
};

const PODIUM = [
  {
    rank: 1,
    icon: "🥇",
    label: "1ère place",
    reward: "Adhésion annuelle offerte + Certification Solimouv' + Goodies",
    gradient: "from-yellow-400/20 via-yellow-400/10 to-transparent",
    border: "border-gradient-gold",
    text: "text-gradient-gold",
    glow: "glow-gold",
    height: "lg:pt-0",
    order: "lg:order-2",
    ring: "ring-2 ring-yellow-400/30",
  },
  {
    rank: 2,
    icon: "🥈",
    label: "2ème place",
    reward: "−50% sur l'adhésion + Certification Solimouv' + Goodies",
    gradient: "from-gray-300/15 via-gray-300/8 to-transparent",
    border: "border-gradient-silver",
    text: "text-gray-300",
    glow: "",
    height: "lg:pt-8",
    order: "lg:order-1",
    ring: "ring-1 ring-gray-400/20",
  },
  {
    rank: 3,
    icon: "🥉",
    label: "3ème place",
    reward: "−30% sur l'adhésion + Certification Solimouv' + Goodies",
    gradient: "from-amber-600/15 via-amber-600/8 to-transparent",
    border: "border-gradient-bronze",
    text: "text-amber-500",
    glow: "",
    height: "lg:pt-16",
    order: "lg:order-3",
    ring: "ring-1 ring-amber-600/20",
  },
];

export default async function ClassementPage() {
  const { data: players } = await supabase
    .from("passport_profiles")
    .select("display_name, total_points, festival_points, challenge_points")
    .eq("festival_year", 2025)
    .order("total_points", { ascending: false })
    .limit(10);

  const top3 = players?.slice(0, 3) ?? [];
  const rest = players?.slice(3) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

      {/* Header */}
      <header className="text-center mb-14">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" aria-hidden="true" />
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">Saison 2025</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
          <span className="text-gradient-gold">Class</span>ement
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Les meilleurs Soli&apos;Athlètes de la saison. Points cumulés au
          festival et sur les défis mensuels tout au long de l&apos;année.
        </p>
      </header>

      {/* Podium */}
      {top3.length > 0 ? (
        <section aria-labelledby="podium-heading" className="mb-12">
          <h2 id="podium-heading" className="sr-only">Top 3 — Podium</h2>

          {/* Podium disposition : 2e | 1er | 3e */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            {[1, 0, 2].map((dataIdx) => {
              const player = top3[dataIdx];
              const p = PODIUM[dataIdx];
              if (!player) return (
                <div key={p.rank} className={`${p.order} ${p.height}`}>
                  <div className={`glass rounded-3xl p-6 text-center opacity-30 ${p.ring}`}>
                    <span className="text-4xl block mb-2" aria-hidden="true">{p.icon}</span>
                    <p className="text-gray-600 text-sm">{p.label}</p>
                    <p className="text-gray-700 text-xs mt-1">Pas encore de participant</p>
                  </div>
                </div>
              );
              return (
                <article
                  key={p.rank}
                  className={`${p.order} ${p.height} relative`}
                  aria-label={`${p.label} : ${player.display_name}`}
                >
                  {/* Glow pour le 1er */}
                  {p.rank === 1 && (
                    <div
                      className="absolute inset-0 rounded-3xl blur-2xl opacity-15 pointer-events-none"
                      style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`relative rounded-3xl p-6 text-center bg-gradient-to-b ${p.gradient} ${p.border} ${p.ring} overflow-hidden`}
                  >
                    {p.rank === 1 && (
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none animate-spin-slow"
                        style={{
                          background: "conic-gradient(from 0deg, #F59E0B, #FCD34D, #F59E0B)",
                          borderRadius: "inherit",
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-5xl block mb-3 relative animate-float" role="img" aria-hidden="true">
                      {p.icon}
                    </span>
                    <p className={`${p.text} text-[10px] font-bold uppercase tracking-widest mb-2`}>{p.label}</p>
                    <p className="text-white font-extrabold text-lg mb-1 truncate">{player.display_name}</p>
                    <p className={`${p.text} text-3xl font-extrabold mb-1`} aria-label={`${player.total_points} points`}>
                      {player.total_points}
                    </p>
                    <p className="text-gray-700 text-[10px] mb-4">points</p>
                    <div className="glass-dark rounded-xl p-2.5 mb-3 text-xs text-gray-500 space-y-0.5">
                      <p>🎪 Festival : <span className="text-gray-400">{player.festival_points} pts</span></p>
                      <p>🎯 Défis : <span className="text-gray-400">{player.challenge_points} pts</span></p>
                    </div>
                    <p className={`text-[11px] ${p.text} opacity-80 leading-relaxed font-medium`}>{p.reward}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mb-12 text-center py-20 glass-card rounded-3xl border border-teal/10">
          <span className="text-6xl block mb-5 animate-float" role="img">🏆</span>
          <h2 className="text-2xl font-extrabold text-white mb-3">Le classement est vide</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Le classement s&apos;affichera dès que des participants auront
            scanné des stands lors du festival.
          </p>
          <Link
            href="/passeport"
            className="inline-flex items-center px-6 py-3 rounded-full font-bold text-navy text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
          >
            Créer mon passeport
          </Link>
        </section>
      )}

      {/* 4ème – 10ème */}
      {rest.length > 0 && (
        <section aria-labelledby="rest-heading" className="mb-12">
          <h2 id="rest-heading" className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎖</span>
            4ème – 10ème
          </h2>
          <ul className="space-y-2" role="list">
            {rest.map((player, i) => (
              <li
                key={player.display_name}
                className="group flex items-center justify-between glass rounded-2xl px-5 py-4 border border-teal/10 hover:border-teal/25 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-mono font-bold w-7 text-center text-sm">{i + 4}</span>
                  <p className="text-white font-semibold">{player.display_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-teal font-extrabold">{player.total_points} pts</p>
                  <p className="text-gray-700 text-xs">Certification + Goodies</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tableau des récompenses */}
      <section aria-labelledby="rewards-heading" className="glass-card rounded-3xl p-6 sm:p-8 border border-teal/10">
        <h2 id="rewards-heading" className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
          <span aria-hidden="true">🎁</span>
          Récompenses de fin d&apos;année
        </h2>
        <ul className="space-y-4" role="list">
          {[
            { icon: "🥇", label: "1ère place", text: "text-gradient-gold", desc: "Adhésion annuelle offerte + Certification Solimouv' + Goodies" },
            { icon: "🥈", label: "2ème place", text: "text-gray-300",      desc: "−50% sur l'adhésion annuelle + Certification Solimouv' + Goodies" },
            { icon: "🥉", label: "3ème place", text: "text-amber-500",     desc: "−30% sur l'adhésion annuelle + Certification Solimouv' + Goodies" },
            { icon: "🎖", label: "4ème – 10ème", text: "text-gray-400",    desc: "Certification Solimouv' + Goodies" },
          ].map(({ icon, label, text, desc }) => (
            <li key={label} className="flex items-start gap-4 group">
              <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform" role="img" aria-label={label}>{icon}</span>
              <div>
                <p className={`${text} font-bold`}>{label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-teal/10 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Classement calculé en décembre sur la totalité des points accumulés.
          </p>
          <Link
            href="/passeport"
            className="inline-flex items-center px-6 py-2.5 rounded-full font-bold text-navy text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00C9A7, #009980)" }}
          >
            🎟 Créer mon Soli&apos;Passeport
          </Link>
        </div>
      </section>
    </div>
  );
}
