import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Classement — Soli'Passeport",
  description:
    "Classement annuel des participants du Soli'Passeport Solimouv'. Les 3 premiers gagnent des récompenses exceptionnelles !",
};

const REWARDS = [
  {
    rank: 1,
    label: "1ère place",
    icon: "🥇",
    reward: "Adhésion annuelle offerte + Certification Solimouv' + Goodies",
    gradient: "from-yellow-400/20 to-yellow-400/5",
    border: "border-yellow-400",
    text: "text-yellow-400",
  },
  {
    rank: 2,
    label: "2ème place",
    icon: "🥈",
    reward: "−50% sur l'adhésion annuelle + Certification Solimouv' + Goodies",
    gradient: "from-gray-300/20 to-gray-300/5",
    border: "border-gray-300",
    text: "text-gray-300",
  },
  {
    rank: 3,
    label: "3ème place",
    icon: "🥉",
    reward: "−30% sur l'adhésion annuelle + Certification Solimouv' + Goodies",
    gradient: "from-amber-600/20 to-amber-600/5",
    border: "border-amber-600",
    text: "text-amber-500",
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
      {/* En-tête */}
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Saison 2025
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Classement
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Les meilleurs Soli&apos;Athlètes de la saison. Points cumulés au
          festival et sur les défis mensuels.
        </p>
      </header>

      {/* Podium */}
      {top3.length > 0 ? (
        <section aria-labelledby="podium-heading" className="mb-10">
          <h2 id="podium-heading" className="sr-only">
            Top 3 — Podium
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((player, i) => {
              const r = REWARDS[i];
              return (
                <article
                  key={player.display_name}
                  className={`bg-gradient-to-b ${r.gradient} border-2 ${r.border} rounded-2xl p-6 text-center`}
                  aria-label={`${r.label} : ${player.display_name}`}
                >
                  <span
                    className="text-5xl block mb-3"
                    role="img"
                    aria-hidden="true"
                  >
                    {r.icon}
                  </span>
                  <p className={`${r.text} text-xs font-semibold uppercase tracking-widest mb-2`}>
                    {r.label}
                  </p>
                  <p className="text-white font-extrabold text-xl mb-1 truncate">
                    {player.display_name}
                  </p>
                  <p
                    className={`${r.text} text-3xl font-extrabold mb-1`}
                    aria-label={`${player.total_points} points`}
                  >
                    {player.total_points}
                  </p>
                  <p className="text-gray-600 text-xs mb-4">points</p>
                  <div className="text-xs text-gray-500 space-y-0.5 mb-4">
                    <p>Festival : {player.festival_points} pts</p>
                    <p>Défis : {player.challenge_points} pts</p>
                  </div>
                  <p
                    className={`text-xs ${r.text} opacity-80 leading-relaxed font-medium`}
                  >
                    {r.reward}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section
          className="text-center py-16 mb-10 bg-navy-light rounded-2xl border border-teal/10"
          aria-label="Aucun participant encore"
        >
          <span className="text-6xl block mb-4" role="img" aria-label="Trophée">
            🏆
          </span>
          <h2 className="text-xl font-bold text-white mb-2">
            Le classement est vide pour l&apos;instant
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Le classement s&apos;affichera dès que des participants auront
            scanné des stands lors du festival !
          </p>
        </section>
      )}

      {/* 4ème – 10ème */}
      {rest.length > 0 && (
        <section aria-labelledby="rest-heading" className="mb-10">
          <h2 id="rest-heading" className="text-xl font-bold text-white mb-4">
            4ème – 10ème
          </h2>
          <ul className="space-y-2" role="list">
            {rest.map((player, i) => (
              <li
                key={player.display_name}
                className="flex items-center justify-between bg-navy-light rounded-xl px-5 py-4 border border-teal/10"
                aria-label={`${i + 4}ème : ${player.display_name}, ${player.total_points} points`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-gray-500 font-mono font-bold w-7 text-center text-sm"
                    aria-hidden="true"
                  >
                    {i + 4}
                  </span>
                  <p className="text-white font-semibold">{player.display_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-teal font-bold">
                    {player.total_points} pts
                  </p>
                  <p className="text-gray-600 text-xs">Certification + Goodies</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tableau des récompenses */}
      <section
        aria-labelledby="rewards-heading"
        className="bg-navy-light rounded-2xl p-6 sm:p-8 border border-teal/20"
      >
        <h2 id="rewards-heading" className="text-xl font-bold text-white mb-6">
          Récompenses de fin d&apos;année
        </h2>
        <ul className="space-y-4" role="list">
          {REWARDS.map(({ rank, label, icon, reward, text }) => (
            <li key={rank} className="flex items-start gap-4">
              <span
                className="text-2xl shrink-0"
                role="img"
                aria-label={label}
              >
                {icon}
              </span>
              <div>
                <p className={`${text} font-semibold`}>{label}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{reward}</p>
              </div>
            </li>
          ))}
          <li className="flex items-start gap-4">
            <span className="text-2xl shrink-0" role="img" aria-label="4ème à 10ème">
              🎖
            </span>
            <div>
              <p className="text-white font-semibold">4ème – 10ème</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Certification Solimouv&apos; + Goodies
              </p>
            </div>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-teal/10 text-center">
          <p className="text-gray-500 text-sm">
            Le classement final est calculé en décembre sur la totalité des
            points accumulés durant le festival et les défis mensuels.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-gray-400 mb-4">
          Pas encore de passeport ? Commence à accumuler des points !
        </p>
        <a
          href="/passeport"
          className="inline-flex items-center justify-center px-8 py-3 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors"
          aria-label="Créer mon Soli'Passeport"
        >
          Créer mon Soli&apos;Passeport 🎟
        </a>
      </div>
    </div>
  );
}
