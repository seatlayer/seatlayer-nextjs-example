"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { SelectionSummary } from "@/components/SelectionSummary";
import { HoldCountdown } from "@/components/HoldCountdown";
import { isConfigured } from "@/lib/config";

/** The chart is browser only, so it is loaded without server rendering. */
const SeatMap = dynamic(() => import("@/components/SeatMap").then((m) => m.SeatMap), {
  ssr: false,
  loading: () => <p className="muted">Loading the seat map</p>,
});

export function SeatSelection() {
  const chartRef = useRef<SeatingChartHandle>(null);
  const [seats, setSeats] = useState<SelectedSeat[]>([]);
  const [hold, setHold] = useState<HoldResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => seats.reduce((sum, seat) => sum + (seat.price ?? 0), 0),
    [seats],
  );

  const run = useCallback(async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }, []);

  const handleExpired = useCallback(() => {
    setHold(null);
    setError("Your hold expired. Pick your seats again.");
  }, []);

  /** Hold the seats the buyer picked on the map. */
  const holdSelection = () =>
    run(async () => {
      const result = await chartRef.current?.hold();
      if (!result) {
        setError("Those seats were just taken. Please pick again.");
        return;
      }
      setHold(result);
    });

  /** Ask the server for the best free seats and hold them in one call. */
  const holdBestAvailable = (quantity: number) =>
    run(async () => {
      const result = await chartRef.current?.bestAvailable(quantity);
      if (!result) {
        setError("No block of that size is free right now.");
        return;
      }
      setHold({ holdId: result.holdId, expiresAt: result.expiresAt, items: result.items });
    });

  const releaseHold = () =>
    run(async () => {
      await chartRef.current?.release();
      setHold(null);
    });

  /**
   * Hand the hold id to the server route, which is where your own checkout
   * session would be created before the hold is booked.
   */
  const continueToCheckout = () =>
    run(async () => {
      if (!hold) return;
      const response = await fetch("/api/hold", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdId: hold.holdId }),
      });
      const payload = await response.json();
      console.log("Continue to checkout with hold id:", hold.holdId, payload);
    });

  if (!isConfigured) {
    return (
      <section className="setup" data-testid="setup-notice">
        <h2>Add your event keys</h2>
        <p>
          Copy <code>.env.example</code> to <code>.env.local</code>, then set{" "}
          <code>NEXT_PUBLIC_SEATLAYER_EVENT_KEY</code> and{" "}
          <code>NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY</code>, then restart the dev server.
        </p>
      </section>
    );
  }

  return (
    <div className="layout">
      <section className="map-panel">
        <SeatMap
          ref={chartRef}
          onSelectionChange={setSeats}
          onHold={setHold}
          onHoldExpired={handleExpired}
          onError={setError}
        />
      </section>

      <aside className="cart-panel">
        <h2>Your seats</h2>
        <SelectionSummary seats={seats} total={total} />
        {hold ? <HoldCountdown expiresAt={hold.expiresAt} onExpired={handleExpired} /> : null}
        {error ? <p className="error">{error}</p> : null}

        <div className="actions">
          <button type="button" onClick={() => holdBestAvailable(2)} disabled={busy}>
            Best available (2 seats)
          </button>

          {hold ? (
            <>
              <button type="button" className="primary" onClick={continueToCheckout} disabled={busy}>
                Continue to checkout
              </button>
              <button type="button" onClick={releaseHold} disabled={busy}>
                Release seats
              </button>
            </>
          ) : (
            <button
              type="button"
              className="primary"
              onClick={holdSelection}
              disabled={busy || seats.length === 0}
            >
              Hold these seats
            </button>
          )}
        </div>

        {hold ? <p className="muted small">Hold id: {hold.holdId}</p> : null}
      </aside>
    </div>
  );
}
