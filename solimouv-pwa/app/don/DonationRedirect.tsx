"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DonationRedirect({ href }: { href: string }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.href = href;
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [href]);

  return (
    <section className="app-card app-card--soft" data-reveal>
      <div className="app-card__content">
        <div className="defis-hero__layout">
          <div className="defis-hero__copy">
            <p className="app-hero__eyebrow">Cagnotte externe</p>
            <h1 className="section-title">Redirection vers la cagnotte</h1>
            <p className="app-hero__description">
              Tu vas etre redirige vers une plateforme de cagnotte externe pour finaliser ton don
              en toute simplicite.
            </p>
            <div className="app-hero__actions">
              <a href={href} className="app-button app-button--primary">
                Ouvrir la cagnotte
              </a>
              <Link href="/" className="app-button app-button--secondary">
                Retour accueil
              </Link>
            </div>
            <p className="highlight-card__note">
              Si la redirection ne se lance pas, utilise le bouton ci-dessus.
            </p>
          </div>

          <div className="defis-hero__art" aria-hidden="true">
            <div className="defis-orbit defis-orbit--one" />
            <div className="defis-orbit defis-orbit--two" />
            <div className="defis-sticker defis-sticker--yellow">DON</div>
            <div className="defis-sticker defis-sticker--lilac">CARE</div>
            <div className="defis-panel">
              <span className="app-pill">Plateforme externe</span>
              <strong>Merci pour ton soutien</strong>
              <p>Chaque contribution aide a financer des activites inclusives, du materiel adapte et des rendez-vous ouverts a tous.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
