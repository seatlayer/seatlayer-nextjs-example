import { RouteIntro } from "@/components/RouteIntro";

/**
 * A page rather than a widget: this route is about the half of the integration
 * that has no browser in it.
 */
export default function Page() {
  return (
    <>
      <RouteIntro
        title="Handing a hold to your own checkout"
        question="How do I hand a seat hold to my own checkout and payment gateway, and what must run on my server rather than in the browser?"
        docsHref="https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/"
        docsLabel="Holds and checkout handoff"
      />

      <section className="prose">
        <h2>What the browser does</h2>
        <p>
          The buyer SDK selects seats and creates a hold. A hold is a short,
          revocable claim on inventory: it is not a ticket and it is not a payment. The
          browser ends up with an opaque hold id and a display-only set of line items. It
          never has booking authority.
        </p>

        <h2>What your server does</h2>
        <p>
          Your server holds the secret key. It reads the hold back from SeatLayer to get the
          authoritative seats and prices, creates your own checkout session for that amount
          with your own payment gateway, and books the hold once the payment has succeeded.
          Your own order id is passed as the booking reference, which is what makes a repeat
          of the same request safe: an unknown outcome is reconciled by repeating it with the
          same reference, never by generating a new one.
        </p>

        <h2>Where it is in this repository</h2>
        <ul>
          <li>
            <code>app/api/hold/route.ts</code> inspects the hold and books it. The server SDK
            path runs only when <code>SEATLAYER_SECRET_KEY</code> is set.
          </li>
          <li>
            <code>app/api/events/route.ts</code> serves the event list, and reads the real
            catalogue with the same key when it is present.
          </li>
          <li>
            <code>components/SeatPickerFlow.tsx</code> is the browser side that produces the
            hold id in the first place.
          </li>
        </ul>

        <h2>Rules that do not bend</h2>
        <ul>
          <li>A secret key never reaches browser code, a response body or a log.</li>
          <li>A price that arrived from a browser is never charged.</li>
          <li>A real conflict is surfaced, not retried in a loop.</li>
          <li>One business order keeps one immutable booking reference for its whole life.</li>
        </ul>

        <p className="muted small">
          More: <a href="https://docs.seatlayer.io/server-api/idempotency-and-conflicts/">
            Idempotency and conflicts
          </a>{" "}
          and <a href="https://docs.seatlayer.io/server-sdk/node/">the Node server SDK</a>.
        </p>
      </section>
    </>
  );
}
