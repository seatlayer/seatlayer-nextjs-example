"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { BestAvailableResult, SeatingChartHandle } from "@seatlayer/react";
import { HoldCountdown } from "@/components/HoldCountdown";
import { Icon } from "@/components/Icon";
import { SetupNotice } from "@/components/SetupNotice";
import { eventKey, isConfigured } from "@/lib/config";

const EventChart = dynamic(() => import("@/components/EventChart").then((m) => m.EventChart), {
  ssr: false,
  loading: () => <p className="demo-loading">Loading the seat map</p>,
});

/**
 * Best available for a group.
 *
 * `bestAvailable(quantity, categoryKey?)` asks the server to find an adjacent
 * block and hold it in the same call. It resolves to null when no such block
 * exists, which is not the same answer as sold out, so the two are worded
 * differently below. Pass a category key from your published chart as the
 * second argument to search one price band only.
 */
export function BestAvailableFlow() {
  const chartRef = useRef<SeatingChartHandle>(null);
  const [quantity, setQuantity] = useState(2);
  const [result, setResult] = useState<BestAvailableResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expire = useCallback(() => {
    setResult(null);
    setError("The hold ran out. Ask for seats again.");
  }, []);

  async function findGroup() {
    setBusy(true);
    setError(null);
    try {
      if (result) await chartRef.current?.release();
      setResult(null);
      const found = await chartRef.current?.bestAvailable(quantity);
      if (!found) {
        setError(`No block of ${quantity} seats together is free right now. Try a smaller group.`);
        return;
      }
      setResult(found);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request could not be completed");
    } finally {
      setBusy(false);
    }
  }

  async function release() {
    await chartRef.current?.release();
    setResult(null);
  }

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  return (
    <section className="demo-frame demo-frame--bar" aria-label="Best available demo">
      <div className="demo-bar">
        <div className="qty" role="group" aria-label="How many seats">
          <span className="qty-label">How many seats</span>
          <button type="button" aria-label="Fewer seats" disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)}>
            <Icon name="minus" />
          </button>
          <b className="mono" aria-live="polite">{quantity}</b>
          <button type="button" aria-label="More seats" disabled={quantity >= 8} onClick={() => setQuantity((q) => q + 1)}>
            <Icon name="plus" />
          </button>
        </div>
        <button type="button" className="btn btn-amber" disabled={busy} onClick={() => void findGroup()}>
          {busy ? "Finding seats" : `Find ${quantity} best ${quantity === 1 ? "seat" : "seats"}`}
        </button>
        <div className="bar-result" aria-live="polite">
          {result ? (
            <>
              <span className="bar-seats">
                Held: <b>{result.labels.join(", ")}</b>
              </span>
              <HoldCountdown expiresAt={result.expiresAt} onExpired={expire} />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => void release()}>
                Release
              </button>
            </>
          ) : error ? (
            <span className="error">{error}</span>
          ) : (
            <span className="muted">SeatLayer finds the best seats next to each other and holds them.</span>
          )}
        </div>
      </div>
      <EventChart
        ref={chartRef}
        eventKey={eventKey}
        onSelectionChange={() => undefined}
        onHold={() => undefined}
        onHoldExpired={expire}
        onError={setError}
      />
    </section>
  );
}
