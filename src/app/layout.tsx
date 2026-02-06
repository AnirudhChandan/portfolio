import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundGrid from "@/components/BackgroundGrid";
import Navbar from "@/components/Navbar"; // <--- 1. IMPORT NAVBAR

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} relative bg-slate-950`}>
        {/* 2. Add Navbar Here */}
        <Navbar />

        <BackgroundGrid />

        {children}
      </body>
    </html>
  );
}
