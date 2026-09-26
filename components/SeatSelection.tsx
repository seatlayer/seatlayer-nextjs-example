"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { SelectionSummary } from "@/components/SelectionSummary";
import { HoldCountdown } from "@/components/HoldCountdown";
import { isConfigured } from "@/lib/config";
import { formatMoney } from "@/lib/money";

/** A line of the hold as your server read it back from SeatLayer. */
interface ServerLine {
  label: string;
  unitPrice: number;
  currency: string;
  quantity?: number;
}

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
  const [serverLines, setServerLines] = useState<ServerLine[] | null>(null);
  const [booking, setBooking] = useState<{ booked: string[]; bookingRef: string } | null>(null);

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
    setServerLines(null);
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
      setBooking(null);
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
      setBooking(null);
      setHold({ holdId: result.holdId, expiresAt: result.expiresAt, items: result.items });
    });

  const releaseHold = () =>
    run(async () => {
      await chartRef.current?.release();
      setHold(null);
      setServerLines(null);
    });

  /**
   * Step 1 of checkout: hand the hold id to your server, which reads the seats
   * and prices back from SeatLayer. The browser never sends a price.
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
      if (!response.ok || !payload.inspected) {
        setError(payload.next ?? payload.error ?? "Your server could not read the hold.");
        return;
      }
      setServerLines(payload.items as ServerLine[]);
    });

  /**
   * Step 2: once payment has succeeded, book the hold with your own order id.
   * This example skips the payment itself.
   */
  const payAndBook = () =>
    run(async () => {
      if (!hold) return;
      const orderId = `order_${Date.now().toString(36)}`;
      const response = await fetch("/api/hold", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdId: hold.holdId, orderId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.booked) {
        setError(payload.error ?? "The booking did not go through. Your seats are still held.");
        return;
      }
      setBooking({ booked: payload.booked, bookingRef: payload.bookingRef });
      setHold(null);
      setServerLines(null);
      setSeats([]);
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
              {serverLines ? null : (
                <button type="button" className="primary" onClick={continueToCheckout} disabled={busy}>
                  Continue to checkout
                </button>
              )}
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

        {serverLines ? (
          <section className="checkout-step" data-testid="server-check">
            <h3>Your server read the hold back</h3>
            <ul>
              {serverLines.map((line) => (
                <li key={line.label}>
                  <span>{line.label}</span>
                  <span className="price">{formatMoney(line.unitPrice * (line.quantity ?? 1), line.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">
              These prices come from SeatLayer, not the browser. Charge this amount, then book.
            </p>
            <button type="button" className="primary" onClick={payAndBook} disabled={busy}>
              Pay (test) and book
            </button>
          </section>
        ) : null}

        {booking ? (
          <section className="checkout-step" data-testid="booking">
            <h3>Booked</h3>
            <p>{booking.booked.join(", ")}</p>
            <p className="muted small">Booking reference: {booking.bookingRef}</p>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
