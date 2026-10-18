import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import Toaster from "@/components/Toaster";
import { themeScript } from "@/components/ThemeToggle";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
  ],
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

const SITE_URL = "https://anirudhchandan.com";
const DESCRIPTION =
  "Backend engineer building APIs, data pipelines and databases — an EHR backend for 2,300+ clinics, a document-workflow platform, and PyDB, a storage engine written from scratch. Live demos and writing inside.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anirudh Chandan | Backend & Systems Engineer",
    template: "%s | Anirudh Chandan",
  },
  description: DESCRIPTION,
  keywords: [
    "Anirudh Chandan",
    "Backend Engineer",
    "Systems Engineer",
    "Distributed Systems",
    "Node.js",
    "System Design",
    "PyDB",
    "B-Tree",
    "Software Engineer India",
  ],
  authors: [{ name: "Anirudh Chandan", url: SITE_URL }],
  creator: "Anirudh Chandan",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Anirudh Chandan",
    title: "Anirudh Chandan | Backend & Systems Engineer",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Anirudh Chandan | Backend & Systems Engineer",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anirudh Chandan",
  url: SITE_URL,
  jobTitle: "Backend & Systems Engineer",
  email: "mailto:anichandan124@gmail.com",
  sameAs: [
    "https://github.com/AnirudhChandan",
    "https://www.linkedin.com/in/anirudh-chandan/",
    "https://leetcode.com/u/crytondre/",
  ],
  knowsAbout: ["Distributed Systems", "Database Internals", "API Design", "System Design", "Node.js"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans relative text-slate-200 antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <div className="bg-noise" />

        <Navbar />

        {children}
        <CommandPalette />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
