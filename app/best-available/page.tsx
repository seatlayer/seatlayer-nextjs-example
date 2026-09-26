import type { Metadata } from "next";
import { DemoShell } from "@/components/DemoShell";
import { BestAvailableFlow } from "@/components/BestAvailableFlow";
import { bestAvailable } from "@/lib/snippets";

export const metadata: Metadata = { title: "Best available" };

export default function Page() {
  return (
    <DemoShell
      slug="best-available"
      lede="Buyers say how many seats they need. SeatLayer finds the best block of seats together and holds it in one call."
      steps={[
        ["Choose how many seats", "From 1 to 8"],
        ["Press Find best seats", "The seats are held for you"],
        ["See them on the map", "Release them to try again"],
      ]}
      code={[{ id: "react", label: "React", file: "components/BestAvailableFlow.tsx", code: bestAvailable }]}
      sourceFile="components/BestAvailableFlow.tsx"
      sideHeading="One call finds and holds"
      sideText="bestAvailable() returns the held seats, or null when no block that size is free. Null is not the same as sold out, so tell the buyer to try a smaller group."
      swapNote={
        <>
          <b>One price band only</b>
          <p>
            Pass a category key from your published chart as the second argument, for example{" "}
            <code>bestAvailable(2, &quot;stalls&quot;)</code>.
          </p>
        </>
      }
      docsHref="https://docs.seatlayer.io/buyer-sdk/best-available/"
    >
      <BestAvailableFlow />
    </DemoShell>
  );
}
