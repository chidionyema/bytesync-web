import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VoiceDock } from "@/components/VoiceDock";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — AI research and tooling`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.tagline, url: site.url },
  twitter: { card: "summary_large_image", title: site.name, description: site.tagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#121317", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] btn">Skip to content</a>
        <div className="progress" aria-hidden="true" />
        <Nav />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <VoiceDock />
      </body>
    </html>
  );
}
