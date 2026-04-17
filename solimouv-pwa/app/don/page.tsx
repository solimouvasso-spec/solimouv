import type { Metadata } from "next";
import DonationRedirect from "./DonationRedirect";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Faire un don",
    description:
      "Redirection vers la cagnotte Solimouv pour soutenir les activites inclusives et les actions du festival.",
  };
}

const CAGNOTTE_URL =
  process.env.NEXT_PUBLIC_CAGNOTTE_URL ?? "https://www.helloasso.com/";

export default function DonPage() {
  return (
    <div className="app-page">
      <div className="app-page__container app-grid">
        <DonationRedirect href={CAGNOTTE_URL} />
      </div>
    </div>
  );
}
