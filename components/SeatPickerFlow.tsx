"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CheckoutHandoff, SeatPickerHandle } from "@seatlayer/react";
import { HandoffTable } from "@/components/HandoffTable";
import { SetupNotice } from "@/components/SetupNotice";
import { formatMoney } from "@/lib/money";
import { isConfigured } from "@/lib/config";

/** The widget is browser only, so it is loaded without server rendering. */
const PickerWidget = dynamic(() => import("@/components/PickerWidget").then((m) => m.PickerWidget), {
  ssr: false,
  loading: () => <p className="demo-loading">Loading the seat picker</p>,
});

/**
 * SeatPicker brings its own map, price list, selection tray, hold countdown
 * and checkout button. This page only shows what your checkout receives when
 * the buyer presses that button.
 */
export function SeatPickerFlow() {
  const pickerRef = useRef<SeatPickerHandle>(null);
  const [handoff, setHandoff] = useState<CheckoutHandoff | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  const seats = handoff?.lineItems.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

  return (
    <>
      <section className="demo-frame" aria-label="Seat picker demo">
        <PickerWidget
          ref={pickerRef}
          onHoldChange={(hold) => {
            if (!hold) setHandoff(null);
          }}
          onCheckout={(next) => {
            setError(null);
            setHandoff(next);
          }}
          onHoldExpired={() => {
            setHandoff(null);
            setError("The hold ran out. Pick your seats again.");
          }}
          onError={setError}
        />
      </section>
      {error ? <p className="error">{error}</p> : null}
      <HandoffTable
        title="What your checkout gets"
        note="After the buyer presses the checkout button"
        empty="Pick seats and press the checkout button in the picker. What your checkout receives appears here."
        rows={
          handoff
            ? [
                { field: "holdId", value: "The hold. Send only this to your server." },
                {
                  field: "expiresAt",
                  value: `${new Date(handoff.expiresAt).toLocaleTimeString("en-GB")}: when the seats go back on sale.`,
                },
                { field: "currency", value: <span className="mono strong">{handoff.currency}</span> },
                {
                  field: "lineItems",
                  value: `${seats} ${seats === 1 ? "seat" : "seats"}: ${handoff.lineItems
                    .map((line) => line.displayLabel ?? line.label)
                    .join(", ")}`,
                },
                {
                  field: "total",
                  value: <span className="mono strong">{formatMoney(handoff.total, handoff.currency)}</span>,
                },
              ]
            : null
        }
      />
    </>
  );
}
