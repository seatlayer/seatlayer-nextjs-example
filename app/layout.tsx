import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatLayer Next.js seating chart example",
  description: "Render a live seating chart, hold seats, and hand the hold to your own checkout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
