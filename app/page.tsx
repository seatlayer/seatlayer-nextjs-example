import { SeatSelection } from "@/components/SeatSelection";

/**
 * A server component page. The seating chart needs the browser, so it lives in
 * the client component below.
 */
export default function Page() {
  return (
    <main className="page">
      <header>
        <h1>Grand Theatre</h1>
        <p className="muted">Choose your seats, hold them, then continue to your own checkout.</p>
      </header>
      <SeatSelection />
    </main>
  );
}
