import type { Metadata } from "next";
import { DemoShell } from "@/components/DemoShell";
import { SeasonFlow } from "@/components/SeasonFlow";
import { seasonTickets, serverHold } from "@/lib/snippets";

export const metadata: Metadata = { title: "Season tickets" };

export default function Page() {
  return (
    <DemoShell
      slug="season-tickets"
      lede="One seat choice for every performance in a season. The seats are held for all of them at once, or not at all."
      steps={[
        ["Pick your seats", "They are yours for every performance"],
        ["Continue", "SeatLayer holds the whole season"],
        ["See what your checkout gets", "Shown under the map"],
      ]}
      code={[
        { id: "react", label: "React", file: "components/SeasonWidget.tsx", code: seasonTickets },
        { id: "server", label: "Server", file: "app/api/hold/route.ts", code: serverHold },
      ]}
      sourceFile="components/SeasonWidget.tsx"
      sideHeading="One hold for the whole season"
      sideText="The handoff carries no price. Your server prices the package from your own rules, charges it, then books every performance."
      swapNote={
        <>
          <b>Swap the season key</b>
          <p>
            Use a published season key (<code>sea_</code>) and a <code>pk_test_</code> key from your dashboard.
          </p>
        </>
      }
      docsHref="https://docs.seatlayer.io/buyer-sdk/seasons/"
    >
      <SeasonFlow />
    </DemoShell>
  );
}
