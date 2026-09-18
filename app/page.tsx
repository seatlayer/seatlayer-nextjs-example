import { RouteIntro } from "@/components/RouteIntro";
import { SeatSelection } from "@/components/SeatSelection";

/**
 * A server component page. The seating chart needs the browser, so it lives in
 * the client component below.
 */
export default function Page() {
  return (
    <>
      <RouteIntro
        title="One event with your own cart"
        question="How do I render the seat map in a Next.js App Router client component and keep my own cart, totals and checkout button?"
        docsHref="https://docs.seatlayer.io/buyer-sdk/react-seating-chart/"
        docsLabel="Add a seat map to a React app"
      />
      <SeatSelection />
    </>
  );
}
