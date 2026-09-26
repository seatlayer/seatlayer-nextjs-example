import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { DemoHeader } from "@/components/DemoHeader";
import { demosUrl, docsUrl, repoUrl, signUpUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SDK demos | SeatLayer", template: "%s · SDK demos | SeatLayer" },
  description:
    "The SeatLayer seat map inside a Next.js app: seat picker, best available, season tickets, multiple events and a checkout handoff to your own payment gateway.",
};

/**
 * Add ?embed=1 to any route to show only the example itself, without the
 * header, for use inside an iframe. The script runs before the first paint, so
 * the header never flashes in or out.
 */
const embedScript = `if (new URLSearchParams(location.search).get("embed") === "1") {
  document.documentElement.dataset.embed = "";
}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The embed script sets an attribute on <html> before React hydrates.
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: embedScript }} />
      </head>
      <body>
        <DemoHeader />
        <main>{children}</main>
        <footer className="foot">
          <div className="wrap foot-in">
            <span>Every demo runs on a real SeatLayer event in test mode. No real money moves.</span>
            <nav aria-label="SeatLayer">
              <a href={demosUrl}>All demos</a>
              <a href={docsUrl}>Docs</a>
              <a href={repoUrl}>GitHub</a>
              <a href={signUpUrl}>Start free</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
