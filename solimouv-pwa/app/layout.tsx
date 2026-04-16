import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Solimouv' — Festival du sport inclusif",
    template: "%s | Solimouv'",
  },
  description:
    "Le festival du sport inclusif organisé par Up Sport! Paris. Venez découvrir des activités adaptées, rencontrer des associations et célébrer la diversité sportive.",
  keywords: [
    "sport inclusif",
    "handicap",
    "festival",
    "Paris",
    "Up Sport",
    "Solimouv",
  ],
  authors: [{ name: "Up Sport! Paris" }],
  creator: "Up Sport! Paris",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Solimouv'",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Solimouv'",
    title: "Solimouv' — Festival du sport inclusif",
    description:
      "Le festival du sport inclusif organisé par Up Sport! Paris.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-navy text-white antialiased">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
