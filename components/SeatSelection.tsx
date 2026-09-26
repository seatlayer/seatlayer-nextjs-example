"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { HoldCountdown } from "@/components/HoldCountdown";
import { SelectionSummary } from "@/components/SelectionSummary";
import { SetupNotice } from "@/components/SetupNotice";
import { isConfigured } from "@/lib/config";
import { formatMoney } from "@/lib/money";
import { withBase } from "@/lib/site";

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
  loading: () => <p className="demo-loading">Loading the seat map</p>,
});

/**
 * Your own cart around the headless SeatingChart, then the three checkout
 * steps: hold in the browser, read the hold back on your server, book.
 */
export function SeatSelection() {
  const chartRef = useRef<SeatingChartHandle>(null);
  const [seats, setSeats] = useState<SelectedSeat[]>([]);
  const [hold, setHold] = useState<HoldResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverLines, setServerLines] = useState<ServerLine[] | null>(null);
  const [noServerKey, setNoServerKey] = useState(false);
  const [booking, setBooking] = useState<{ booked: string[]; bookingRef: string } | null>(null);

  const total = useMemo(() => seats.reduce((sum, seat) => sum + (seat.price ?? 0), 0), [seats]);

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
    setError("Your hold ran out. Pick your seats again.");
  }, []);

  /** Step 1: hold the seats the buyer picked, then hand the hold id to your server. */
  const continueToCheckout = () =>
    run(async () => {
      let current = hold;
      if (!current) {
        const result = await chartRef.current?.hold();
        if (!result) {
          setError("Those seats were just taken. Please pick again.");
          return;
        }
        setBooking(null);
        setHold(result);
        current = result;
      }
      // Step 2: your server reads the seats and prices back from SeatLayer.
      // The browser never sends a price.
      const response = await fetch(withBase("/api/hold"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdId: current.holdId }),
      });
      const payload = await response.json();
      if (response.ok && payload.inspected === false) {
        setNoServerKey(true);
        return;
      }
      if (!response.ok || !payload.inspected) {
        setError("Your server could not read the hold. Your seats are still held.");
        return;
      }
      setServerLines(payload.items as ServerLine[]);
    });

  const releaseHold = () =>
    run(async () => {
      await chartRef.current?.release();
      setHold(null);
      setServerLines(null);
      setNoServerKey(false);
    });

  /**
   * Step 3: after your payment gateway confirms the charge, book the hold with
   * your own order id. This example skips the payment itself.
   */
  const payAndBook = () =>
    run(async () => {
      if (!hold) return;
      const orderId = `order_${Date.now().toString(36)}`;
      const response = await fetch(withBase("/api/hold"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdId: hold.holdId, orderId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.booked) {
        setError("The booking did not go through. Your seats are still held.");
        return;
      }
      setBooking({ booked: payload.booked, bookingRef: payload.bookingRef });
      setHold(null);
      setServerLines(null);
      setSeats([]);
    });

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  const step = booking ? 3 : serverLines || noServerKey ? 2 : hold ? 1 : 0;

  return (
    <>
      <section className="demo-frame demo-frame--bar" aria-label="Checkout handoff demo">
        <SeatMap
          ref={chartRef}
          onSelectionChange={setSeats}
          onHold={setHold}
          onHoldExpired={handleExpired}
          onError={setError}
        />
        <div className="cart-bar">
          <div className="cart-bar-main">
            <b>Your cart</b>
            <SelectionSummary seats={seats} total={total} />
          </div>
          <div className="cart-bar-side">
            {hold ? <HoldCountdown expiresAt={hold.expiresAt} onExpired={handleExpired} /> : null}
            {error ? <p className="error">{error}</p> : null}
            <div className="cart-actions">
              {hold ? (
                <button type="button" className="btn btn-ghost" onClick={releaseHold} disabled={busy}>
                  Release seats
                </button>
              ) : null}
              <button
                type="button"
                className="btn btn-amber"
                onClick={continueToCheckout}
                disabled={busy || (seats.length === 0 && !hold) || step >= 2}
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="steps3" aria-label="What happens at checkout" aria-live="polite">
        <div className={step >= 1 ? "s3 done" : "s3"}>
          <span className="s3-n">1</span>
          <div>
            <b>The browser holds the seats</b>
            <p>{hold ? "Held. Only the hold id goes to your server." : "Pick seats and press Continue to checkout."}</p>
          </div>
        </div>
        <div className={step >= 2 ? "s3 done" : "s3"}>
          <span className="s3-n">2</span>
          <div>
            <b>Your server reads the hold back</b>
            {serverLines ? (
              <>
                <ul className="seat-list">
                  {serverLines.map((line) => (
                    <li key={line.label}>
                      <span>{line.label}</span>
                      <span className="price">{formatMoney(line.unitPrice * (line.quantity ?? 1), line.currency)}</span>
                    </li>
                  ))}
                </ul>
                <p>These prices come from SeatLayer, not the browser. Charge this amount.</p>
              </>
            ) : noServerKey ? (
              <p>
                This copy runs without a secret key, so it stops here. With <code>SEATLAYER_SECRET_KEY</code> set,
                your server gets the seats and prices at this step.
              </p>
            ) : (
              <p>Seats and prices come from SeatLayer, never from the browser.</p>
            )}
          </div>
        </div>
        <div className={step >= 3 ? "s3 done" : "s3"}>
          <span className="s3-n">3</span>
          <div>
            <b>Your server books it</b>
            {booking ? (
              <p>
                Booked: {booking.booked.join(", ")}. Reference <span className="mono">{booking.bookingRef}</span>.
              </p>
            ) : serverLines ? (
              <button type="button" className="btn btn-amber btn-sm" onClick={payAndBook} disabled={busy}>
                Pay (test) and book
              </button>
            ) : (
              <p>After your payment gateway confirms, book with your own order id.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
