import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import BackgroundGrid from "@/components/BackgroundGrid";
import Navbar from "@/components/Navbar";

// Setup Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Setup Space Grotesk for headings and impact numbers
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Anirudh Chandan | Software Engineer",
  description:
    "Portfolio of Anirudh Chandan, a Software Engineer specializing in scalable backend systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        /* Inject both font variables and set default to sans */
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans relative bg-slate-950 text-slate-200 antialiased`}
      >
        <div className="bg-noise" />

        <Navbar />
        <BackgroundGrid />

        {children}
      </body>
    </html>
  );
}
