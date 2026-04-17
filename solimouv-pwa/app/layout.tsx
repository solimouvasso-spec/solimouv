import type { Metadata, Viewport } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal"],
});

export const viewport: Viewport = {
  themeColor: "#5f2482",
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
  keywords: ["sport inclusif", "handicap", "festival", "Paris", "Up Sport", "Solimouv"],
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
    description: "Le festival du sport inclusif organisé par Up Sport! Paris.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} ${barlow.variable} h-full`}>
      <body className="min-h-full bg-[#5f2482] text-white antialiased">
        <AppShell>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </AppShell>
      </body>
    </html>
  );
}
