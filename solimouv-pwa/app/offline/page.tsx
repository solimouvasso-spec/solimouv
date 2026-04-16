import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hors ligne",
  description: "Vous êtes actuellement hors ligne.",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <span className="text-7xl mb-6 block" role="img" aria-label="Hors ligne">
        📶
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
        Vous êtes hors ligne
      </h1>
      <p className="text-gray-400 text-lg max-w-md mb-8 leading-relaxed">
        Pas de connexion internet. Certaines fonctionnalités nécessitent une
        connexion pour fonctionner.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-teal text-navy font-bold rounded-full hover:bg-teal/90 transition-colors"
          aria-label="Retourner à l'accueil"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/passeport"
          className="px-6 py-3 border border-teal text-teal font-bold rounded-full hover:bg-teal/10 transition-colors"
          aria-label="Voir mon Soli'Passeport"
        >
          Mon passeport
        </Link>
      </div>
    </div>
  );
}
