"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { BestAvailableResult, SeatingChartHandle } from "@seatlayer/react";
import { SetupNotice } from "@/components/SetupNotice";
import { eventKey, isConfigured } from "@/lib/config";

const EventChart = dynamic(() => import("@/components/EventChart").then((m) => m.EventChart), {
  ssr: false,
  loading: () => <p className="muted">Loading the seat map</p>,
});

const quantities = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Best available for a group.
 *
 * `bestAvailable(quantity, categoryKey?)` asks the server to find an adjacent
 * block and hold it in the same call. It resolves to null when no such block
 * exists, which is not the same answer as sold out, so the two are worded
 * differently below.
 *
 * The category filter is a plain field: the buyer SDK exposes the category on
 * each selected seat, not a list of the chart's categories, so the stable
 * category key from the published chart is typed in.
 */
export function BestAvailableFlow() {
  const chartRef = useRef<SeatingChartHandle>(null);
  const [quantity, setQuantity] = useState(4);
  const [categoryKey, setCategoryKey] = useState("");
  const [result, setResult] = useState<BestAvailableResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function findGroup() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const key = categoryKey.trim();
      const found = await chartRef.current?.bestAvailable(
        quantity,
        key.length > 0 ? key : undefined,
      );
      if (!found) {
        setError(
          `No block of ${quantity} seats together is available right now. Try a smaller group or another category.`,
        );
        return;
      }
      setResult(found);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request could not be completed");
    } finally {
      setBusy(false);
    }
  }

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
        <EventChart
          ref={chartRef}
          eventKey={eventKey}
          onSelectionChange={() => undefined}
          onHold={() => undefined}
          onHoldExpired={() => undefined}
          onError={setError}
        />
      </section>

      <aside className="cart-panel">
        <h2>Find seats together</h2>
        <label className="field">
          <span>How many seats</span>
          <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
            {quantities.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Category key (optional)</span>
          <input
            type="text"
            value={categoryKey}
            placeholder="stalls"
            onChange={(event) => setCategoryKey(event.target.value)}
          />
        </label>
        <div className="actions">
          <button type="button" className="primary" disabled={busy} onClick={() => void findGroup()}>
            Find and hold
          </button>
        </div>

        {result ? (
          <div>
            <p className="total">
              <span>Held</span>
              <span>{result.labels.length} seats</span>
            </p>
            <ul className="seat-list">
              {result.labels.map((label) => (
                <li key={label}>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">Hold id: {result.holdId}</p>
          </div>
        ) : null}
        {error ? <p className="error">{error}</p> : null}
      </aside>
    </div>
  );
}
