import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/providers/AppProviders";
import { Cursor } from "@/components/ui/Cursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { EasterEggs } from "@/components/easter/EasterEggs";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const displayGrotesk = Space_Grotesk({
  variable: "--font-display-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insider-x.io"),
  title: {
    default: "Insider-X — The fastest execution engine on Solana",
    template: "%s · Insider-X",
  },
  description:
    "Command a fleet of up to 500 wallets in parallel. Sub-200ms quote-to-fill across pump.fun, Raydium, Jupiter, Drift and every Solana alt-market that matters.",
  keywords: [
    "Solana trading",
    "pump.fun",
    "Raydium",
    "Jupiter",
    "Drift",
    "memecoin",
    "sniper",
    "MEV",
    "Axiom alternative",
    "Trojan alternative",
    "Photon alternative",
  ],
  openGraph: {
    type: "website",
    siteName: "Insider-X",
    title: "Insider-X — The fastest execution engine on Solana",
    description:
      "Command a fleet of up to 500 wallets in parallel. Sub-200ms quote-to-fill across every Solana alt-market.",
    url: "https://insider-x.io",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Insider-X — Command a fleet of 500 wallets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@insiderx",
    creator: "@insiderx",
    title: "Insider-X — The fastest execution engine on Solana",
    description:
      "Command a fleet of 500 wallets. Trade faster than light. Sub-200ms quote-to-fill on Solana.",
    images: ["/api/og"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050008",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displayGrotesk.variable} h-full antialiased grain`}
    >
      <body className="min-h-full flex flex-col bg-[color:var(--color-ix-bg)] text-[color:var(--color-ix-fg)]">
        <JsonLd />
        <AppProviders>
          <Cursor />
          <EasterEggs />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
