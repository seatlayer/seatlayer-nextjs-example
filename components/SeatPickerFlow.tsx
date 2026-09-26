"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CheckoutHandoff, SeatPickerHandle } from "@seatlayer/react";
import { SetupNotice } from "@/components/SetupNotice";
import { formatMoney } from "@/lib/money";
import { isConfigured } from "@/lib/config";

/** The widget is browser only, so it is loaded without server rendering. */
const PickerWidget = dynamic(() => import("@/components/PickerWidget").then((m) => m.PickerWidget), {
  ssr: false,
  loading: () => <p className="muted">Loading the seat picker</p>,
});

export function SeatPickerFlow() {
  const pickerRef = useRef<SeatPickerHandle>(null);
  const [handoff, setHandoff] = useState<CheckoutHandoff | null>(null);
  const [held, setHeld] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  return (
    <div className="layout">
      <section className="map-panel">
        <PickerWidget
          ref={pickerRef}
          onHoldChange={(hold) => setHeld(hold !== null)}
          onCheckout={setHandoff}
          onHoldExpired={() => {
            setHandoff(null);
            setError("The hold expired. Pick your seats again.");
          }}
          onError={setError}
        />
      </section>

      <aside className="cart-panel">
        <h2>Checkout handoff</h2>
        {handoff ? (
          <div>
            <ul className="seat-list">
              {handoff.lineItems.map((line) => (
                <li key={line.label}>
                  <span>{line.displayLabel ?? line.label}</span>
                  <span className="price">{formatMoney(line.unitPrice * line.quantity, line.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="total">
              <span>Total</span>
              <span className="price">{formatMoney(handoff.total, handoff.currency)}</span>
            </p>
            <p className="muted small">Hold id: {handoff.holdId}</p>
            <p className="muted">
              Post only this hold id to a route handler. Your server reads the authoritative
              prices back from SeatLayer, charges the buyer through your own payment gateway,
              and books the hold.
            </p>
          </div>
        ) : (
          <p className="muted">
            Pick seats and press the picker&apos;s own checkout button. The handoff appears here.
          </p>
        )}
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button
            type="button"
            disabled={!held}
            onClick={() => {
              void pickerRef.current?.release();
              setHandoff(null);
            }}
          >
            Release the hold
          </button>
        </div>
      </aside>
    </div>
  );
}
