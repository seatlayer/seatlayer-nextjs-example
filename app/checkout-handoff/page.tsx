import type { Metadata } from "next";
import { DemoShell } from "@/components/DemoShell";
import { SeatSelection } from "@/components/SeatSelection";
import { ownCart, serverHold } from "@/lib/snippets";

export const metadata: Metadata = { title: "Checkout handoff" };

export default function Page() {
  return (
    <DemoShell
      slug="checkout-handoff"
      lede="Your own cart around the seat map, then the part with no browser in it: your server reads the hold back from SeatLayer and books it."
      steps={[
        ["Pick seats", "They land in your own cart"],
        ["Press Continue to checkout", "The browser holds them"],
        ["Watch your server's steps", "Read the hold, then book"],
      ]}
      code={[
        { id: "react", label: "React", file: "components/SeatSelection.tsx", code: ownCart },
        { id: "server", label: "Server", file: "app/api/hold/route.ts", code: serverHold },
      ]}
      sourceFile="app/api/hold/route.ts"
      sideHeading="Rules that do not bend"
      sideText="A secret key never reaches the browser. A price that came from a browser is never charged. One order keeps one booking reference, so a retry can never sell twice."
      swapNote={
        <>
          <b>Turn on the server steps</b>
          <p>
            Set <code>SEATLAYER_SECRET_KEY</code> in <code>.env.local</code>. It is read only inside the route
            handler and never sent to the browser.
          </p>
        </>
      }
      docsHref="https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/"
    >
      <SeatSelection />
    </DemoShell>
  );
}
