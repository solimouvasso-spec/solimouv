import type { Metadata } from "next";
import DonForm from "./DonForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Faire un don",
    description:
      "Soutenez Up Sport! Paris et le festival Solimouv' en faisant un don. Votre contribution finance des équipements adaptés et des activités gratuites.",
  };
}

export default function DonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Agir concrètement
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Faire un don
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Chaque euro donné soutient directement des pratiquants et des
          associations qui œuvrent pour un sport plus inclusif.
        </p>
      </header>

      <DonForm />
    </div>
  );
}
