import type { Metadata } from "next";
import { DemoShell } from "@/components/DemoShell";
import { EventSwitcher } from "@/components/EventSwitcher";
import { eventsRoute, multipleEvents } from "@/lib/snippets";

export const metadata: Metadata = { title: "Multiple events" };

export default function Page() {
  return (
    <DemoShell
      slug="multiple-events"
      lede="Several events on one page with one seat map. Switching events loads that event's own seats, and any hold on the last one is released."
      steps={[
        ["Choose an event", "Above the map"],
        ["Pick seats", "Tap open seats on the map"],
        ["Hold them", "Switch events to see the hold released"],
      ]}
      code={[
        { id: "react", label: "React", file: "components/EventSwitcher.tsx", code: multipleEvents },
        { id: "server", label: "Server", file: "app/api/events/route.ts", code: eventsRoute },
      ]}
      sourceFile="components/EventSwitcher.tsx"
      sideHeading="Your server picks the events"
      sideText="The list comes from your own route. It shows only the events you choose, never your whole account."
      swapNote={
        <>
          <b>Swap the event keys</b>
          <p>
            Set up to three event keys in <code>.env.local</code>. With a secret key on the server, the route
            reads each event&apos;s real name.
          </p>
        </>
      }
      docsHref="https://docs.seatlayer.io/server-api/events/"
    >
      <EventSwitcher />
    </DemoShell>
  );
}
