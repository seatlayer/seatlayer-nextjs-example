import type { Metadata } from "next";
import { DemoShell } from "@/components/DemoShell";
import { SeatPickerFlow } from "@/components/SeatPickerFlow";
import { seatPicker, serverHold } from "@/lib/snippets";

export const metadata: Metadata = { title: "Seat picker" };

export default function Page() {
  return (
    <DemoShell
      slug="seat-picker"
      lede="The SeatPicker component inside a React app. Buyers pick seats, SeatLayer holds them, and your own checkout takes the payment."
      steps={[
        ["Pick seats on the map", "Any open seat"],
        ["Press the checkout button", "SeatLayer holds the seats"],
        ["See what your checkout gets", "Shown under the map"],
      ]}
      code={[
        { id: "react", label: "React", file: "components/PickerWidget.tsx", code: seatPicker },
        { id: "server", label: "Server", file: "app/api/hold/route.ts", code: serverHold },
      ]}
      sourceFile="components/PickerWidget.tsx"
      sideHeading="The browser picks, your server books"
      sideText="The picker brings its own map, cart and hold timer. Your server checks the hold and takes the payment."
      swapNote={
        <>
          <b>Swap the keys</b>
          <p>
            Use your event key and a <code>pk_test_</code> key from your dashboard. Keep the <code>sk_</code>{" "}
            secret key on your server.
          </p>
        </>
      }
      docsHref="https://docs.seatlayer.io/buyer-sdk/seat-picker/"
    >
      <SeatPickerFlow />
    </DemoShell>
  );
}
