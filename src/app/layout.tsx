import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import BackgroundGrid from "@/components/BackgroundGrid";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

const SITE_URL = "https://anirudh-chandan.vercel.app";
const DESCRIPTION =
  "Backend & systems engineer specializing in scalable APIs, distributed systems, and databases. Creator of PyDB, a from-scratch B-Tree storage engine — explore live, interactive demos.";

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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans relative bg-slate-950 text-slate-200 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <div className="bg-noise" />

        <Navbar />
        <BackgroundGrid />

        {children}
      </body>
    </html>
  );
}
