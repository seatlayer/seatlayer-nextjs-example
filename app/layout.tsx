import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatLayer Next.js seating chart examples",
  description:
    "Seat selection, holds, season tickets, multiple events and best available in a Next.js App Router application.",
};

/**
 * Add ?embed=1 to any route to show only the example itself, without the
 * navigation and the route heading, for use inside an iframe. The script runs
 * before the first paint, so the navigation never flashes in or out.
 */
const embedScript = `if (new URLSearchParams(location.search).get("embed") === "1") {
  document.documentElement.dataset.embed = "";
}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The embed script sets an attribute on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: embedScript }} />
      </head>
      <body>
        <div className="page">
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
