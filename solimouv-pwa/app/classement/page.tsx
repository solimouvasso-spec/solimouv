import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Classement — Soli'Passeport",
  description:
    "Classement annuel Solimouv' avec podium, top 10 et systeme de recompenses par classification.",
};

const REWARDS = [
  {
    rank: "1er",
    icon: "🥇",
    title: "Adhesion annuelle offerte",
    description: "Certification Solimouv + goodies exclusifs",
    accent: "yellow",
  },
  {
    rank: "2eme",
    icon: "🥈",
    title: "-50% sur l'adhesion annuelle",
    description: "Certification Solimouv + goodies",
    accent: "lilac",
  },
  {
    rank: "3eme",
    icon: "🥉",
    title: "-30% sur l'adhesion annuelle",
    description: "Certification Solimouv + goodies",
    accent: "teal",
  },
  {
    rank: "4eme a 10eme",
    icon: "🎖️",
    title: "Certification Solimouv",
    description: "Goodies remis en fin de saison",
    accent: "soft",
  },
];

const POINT_CLASSES = [
  {
    range: "0 - 99 pts",
    title: "Explorateur",
    description: "Tu decouvres le festival, les stands et les premieres activites inclusives.",
    perks: "Acces au parcours + progression visible dans le pass",
    accent: "soft",
  },
  {
    range: "100 - 249 pts",
    title: "Engage",
    description: "Tu participes activement, tu scans plusieurs stands et tu commences a relever des defis.",
    perks: "Mise en avant dans le classement + badge de progression",
    accent: "lilac",
  },
  {
    range: "250 - 499 pts",
    title: "Ambassadeur",
    description: "Tu fais vivre l'experience Solimouv dans la duree et tu restes present sur plusieurs temps forts.",
    perks: "Priorite symbolique sur les recompenses intermediaires + certificat de parcours",
    accent: "teal",
  },
  {
    range: "500+ pts",
    title: "Soli'Athlete",
    description: "Tu fais partie des profils les plus investis de la saison et tu vis pleinement l'ecosysteme Solimouv.",
    perks: "Eligible aux plus fortes recompenses annuelles selon ton rang final",
    accent: "yellow",
  },
];

function rewardTextForRank(rank: number) {
  if (rank === 1) return "Adhesion offerte + certification + goodies";
  if (rank === 2) return "-50% adhesion + certification + goodies";
  if (rank === 3) return "-30% adhesion + certification + goodies";
  if (rank >= 4 && rank <= 10) return "Certification + goodies";
  return "Participation au classement";
}

function toneForRank(rank: number) {
  if (rank === 1) return "defis-card--yellow";
  if (rank === 2) return "defis-card--lilac";
  if (rank === 3) return "defis-card--teal";
  return "defis-card--soft";
}

export default async function ClassementPage() {
  const seasonYear = 2025;

  const { data: players } = await supabase
    .from("passport_profiles")
    .select("display_name, total_points, festival_points, challenge_points")
    .eq("festival_year", seasonYear)
    .order("total_points", { ascending: false })
    .limit(10);

  const top3 = players?.slice(0, 3) ?? [];
  const rest = players?.slice(3) ?? [];

  return (
    <div className="app-page classement-page">
      <div className="app-page__container app-grid">
        <section className="app-card classement-hero" data-reveal>
          <div className="app-card__content">
            <div className="classement-hero__layout">
              <div className="classement-hero__copy">
                <p className="app-hero__eyebrow">Saison {seasonYear}</p>
                <h1 className="app-hero__title">Classement annuel</h1>
                <p className="app-hero__description">
                  Le classement recompense les participants les plus engages sur le festival et
                  dans les defis mensuels tout au long de l&apos;annee.
                </p>

                <div className="hero-meta-grid">
                  <article className="hero-meta-card">
                    <p>Top recompense</p>
                    <p>Adhesion offerte</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>Top 3</p>
                    <p>Certification + goodies</p>
                  </article>
                  <article className="hero-meta-card">
                    <p>4 a 10</p>
                    <p>Certification</p>
                  </article>
                </div>

                <div className="app-hero__actions">
                  <Link href="/passeport" className="app-button app-button--primary">
                    Creer mon passeport
                  </Link>
                  <Link href="/defis" className="app-button app-button--secondary">
                    Voir les defis
                  </Link>
                </div>
              </div>

              <div className="classement-hero__art" aria-hidden="true">
                <div className="classement-orbit classement-orbit--one" />
                <div className="classement-orbit classement-orbit--two" />
                <div className="classement-sticker classement-sticker--yellow">TOP 10</div>
                <div className="classement-sticker classement-sticker--lilac">REWARDS</div>
                <div className="classement-stats-card">
                  <span className="app-pill">Objectif saison</span>
                  <strong>Monter dans le top</strong>
                  <p>Festival + defis = points cumules. Chaque scan et chaque participation compte.</p>
                </div>
                <div className="classement-crowns">
                  <span>✦</span>
                  <span>✺</span>
                  <span>✦</span>
                </div>
                <div className="defis-panel classement-panel">
                  <span className="app-pill">Gain par classification</span>
                  <strong>Chaque place compte</strong>
                  <p>Le podium obtient les plus gros avantages, mais le top 10 repart aussi avec une vraie reconnaissance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="app-card app-card--soft" data-reveal aria-labelledby="rewards-heading">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Recompenses</p>
              <h2 id="rewards-heading" className="section-title">
                Gain par classification
              </h2>
              <p className="app-hero__description">
                Voici la grille de recompenses que tu m&apos;as donnee, transformee en systeme clair dans l&apos;interface.
              </p>
            </div>

            <div className="classement-rewards-grid stagger-list">
              {REWARDS.map((reward, index) => (
                <article
                  key={reward.rank}
                  className={`highlight-card classement-reward-card ${reward.accent === "yellow"
                    ? "defis-card--yellow"
                    : reward.accent === "lilac"
                      ? "defis-card--lilac"
                      : reward.accent === "teal"
                        ? "defis-card--teal"
                        : "defis-card--soft"}`}
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill">{reward.rank}</span>
                  <div className="classement-reward-card__icon" aria-hidden="true">{reward.icon}</div>
                  <h3>
                    {reward.title}
                  </h3>
                  <p>{reward.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-card" data-reveal aria-labelledby="points-heading">
          <div className="app-card__content">
            <div className="section-heading">
              <p className="app-hero__eyebrow">Classification des points</p>
              <h2 id="points-heading" className="section-title">
                Les paliers de progression
              </h2>
              <p className="app-hero__description">
                En plus du classement annuel, les points permettent aussi de situer ton niveau
                d&apos;engagement dans l&apos;experience Solimouv.
              </p>
            </div>

            <div className="classement-points-grid stagger-list">
              {POINT_CLASSES.map((tier, index) => (
                <article
                  key={tier.range}
                  className={`highlight-card classement-points-card ${tier.accent === "yellow"
                    ? "defis-card--yellow"
                    : tier.accent === "lilac"
                      ? "defis-card--lilac"
                      : tier.accent === "teal"
                        ? "defis-card--teal"
                        : "defis-card--soft"}`}
                  data-reveal
                  style={{ ["--stagger-index" as string]: index }}
                >
                  <span className="app-pill">{tier.range}</span>
                  <h3>{tier.title}</h3>
                  <p>{tier.description}</p>
                  <p className="highlight-card__note">{tier.perks}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {top3.length > 0 ? (
          <section className="app-card" data-reveal aria-labelledby="podium-heading">
            <div className="app-card__content">
              <div className="section-heading">
                <p className="app-hero__eyebrow">Podium</p>
                <h2 id="podium-heading" className="section-title">
                  Les 3 premiers de la saison
                </h2>
              </div>

              <div className="classement-podium stagger-list">
                {[1, 0, 2].map((orderIndex, index) => {
                  const player = top3[orderIndex];
                  const rank = orderIndex + 1;

                  if (!player) {
                    return (
                      <article
                        key={`empty-${rank}`}
                        className="highlight-card classement-podium-card defis-card--soft"
                        data-reveal
                        style={{ ["--stagger-index" as string]: index }}
                      >
                        <span className="app-pill">{rank}e place</span>
                        <h3>En attente</h3>
                        <p>Cette place se debloquera des que le classement se remplit.</p>
                      </article>
                    );
                  }

                  return (
                    <article
                      key={player.display_name + rank}
                      className={`highlight-card classement-podium-card classement-podium-card--${rank} ${toneForRank(rank)}`}
                      data-reveal
                      style={{ ["--stagger-index" as string]: index }}
                    >
                      <span className="app-pill">{rank === 1 ? "1er" : `${rank}eme`}</span>
                      <div className="classement-podium-card__medal" aria-hidden="true">
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                      </div>
                      <h3>{player.display_name}</h3>
                      <p>{player.total_points} points</p>
                      <p className="highlight-card__note">
                        Festival: {player.festival_points} pts · Defis: {player.challenge_points} pts
                      </p>
                      <p className="highlight-card__note">{rewardTextForRank(rank)}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="app-card app-card--soft" data-reveal>
            <div className="app-card__content defis-empty">
              <div className="defis-empty__art" aria-hidden="true">
                <span className="defis-empty__dot defis-empty__dot--one" />
                <span className="defis-empty__dot defis-empty__dot--two" />
                <span className="defis-empty__icon">🏆</span>
              </div>
              <div>
                <h3>Le classement est vide pour le moment</h3>
                <p>
                  Le top 10 s&apos;affichera des que les premiers participants auront commence a scanner
                  des stands et relever des defis.
                </p>
              </div>
              <div className="defis-empty__actions">
                <Link href="/passeport" className="app-button app-button--primary">
                  Creer mon passeport
                </Link>
                <Link href="/programme" className="app-button app-button--secondary">
                  Voir le parcours
                </Link>
              </div>
            </div>
          </section>
        )}

        {rest.length > 0 ? (
          <section className="app-card" data-reveal aria-labelledby="top10-heading">
            <div className="app-card__content">
              <div className="section-heading">
                <p className="app-hero__eyebrow">Top 10</p>
                <h2 id="top10-heading" className="section-title">
                  4eme a 10eme place
                </h2>
              </div>

              <div className="timeline stagger-list">
                {rest.map((player, index) => {
                  const rank = index + 4;
                  return (
                    <article
                      key={player.display_name + rank}
                      className="timeline-item classement-rank-row"
                      data-reveal
                      style={{ ["--stagger-index" as string]: index }}
                    >
                      <time className="timeline-time" dateTime={`rank-${rank}`}>
                        {rank}
                      </time>
                      <div className="timeline-card">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="app-pill">Top 10</span>
                          <span className="map-chip map-chip--lilac">Certification + goodies</span>
                        </div>
                        <h3 className="timeline-card__title">{player.display_name}</h3>
                        <p className="timeline-card__copy">
                          {player.total_points} points cumules sur l&apos;annee.
                        </p>
                        <p className="highlight-card__note">
                          Festival: {player.festival_points} pts · Defis: {player.challenge_points} pts
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="app-card app-card--soft" data-reveal>
          <div className="app-card__content defis-cta">
            <div>
              <p className="app-hero__eyebrow mb-2">Comment gagner</p>
              <h2 className="section-title">Cumule tes points toute l&apos;annee</h2>
              <p className="app-hero__description max-w-none">
                Le classement prend en compte les points festival et les points de defis. Plus tu avances dans le parcours, plus tu montes.
              </p>
            </div>
            <div className="defis-cta__actions">
              <Link href="/scan" className="app-button app-button--primary">
                Scanner un stand
              </Link>
              <Link href="/defis" className="app-button app-button--secondary">
                Relever un defi
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
