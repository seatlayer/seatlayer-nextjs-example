import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatLayer Next.js seating chart examples",
  description:
    "Seat selection, holds, season tickets, multiple events and best available in a Next.js App Router application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
