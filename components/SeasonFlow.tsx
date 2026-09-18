"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type {
  SeasonAvailability,
  SeasonCheckoutHandoff,
  SeasonDescriptor,
  SeasonPickerHandle,
  SeasonRenewalIntent,
} from "@seatlayer/react";
import { SetupNotice } from "@/components/SetupNotice";
import { isSeasonConfigured } from "@/lib/config";

const SeasonWidget = dynamic(() => import("@/components/SeasonWidget").then((m) => m.SeasonWidget), {
  ssr: false,
  loading: () => <p className="muted">Loading the season</p>,
});

/** Caller-stable ids let an interrupted operation be recovered rather than repeated. */
function newActionId(): string {
  return crypto.randomUUID();
}

export function SeasonFlow() {
  const pickerRef = useRef<SeasonPickerHandle>(null);
  const [descriptor, setDescriptor] = useState<SeasonDescriptor | null>(null);
  const [availability, setAvailability] = useState<SeasonAvailability | null>(null);
  const [handoff, setHandoff] = useState<SeasonCheckoutHandoff | null>(null);
  const [renewal, setRenewal] = useState<SeasonRenewalIntent | null>(null);
  const [offerId, setOfferId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** A returning holder records intent to renew. It is intent only, never a sale. */
  async function recordRenewalIntent() {
    setError(null);
    try {
      const intent = await pickerRef.current?.createRenewalIntent(offerId.trim());
      setRenewal(intent ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The renewal offer could not be read");
    }
  }

  if (!isSeasonConfigured) {
    return <SetupNotice variables={["NEXT_PUBLIC_SEATLAYER_SEASON_KEY"]} />;
  }

  return (
    <div className="layout">
      <section className="map-panel">
        <SeasonWidget
          ref={pickerRef}
          onStatusChange={(event) => {
            setStatus(event.message);
            if (event.kind === "ready") {
              setDescriptor(pickerRef.current?.getDescriptor() ?? null);
              setAvailability(pickerRef.current?.getAvailability() ?? null);
            }
          }}
          onHandoff={setHandoff}
          onHoldExpired={() => {
            setHandoff(null);
            setError("The season hold expired. Choose your seats again.");
          }}
          onError={setError}
        />
      </section>

      <aside className="cart-panel">
        <h2>Season package</h2>
        {descriptor ? (
          <ul className="seat-list">
            <li>
              <span>Season</span>
              <span>{descriptor.name}</span>
            </li>
            <li>
              <span>Venue</span>
              <span>{descriptor.venue}</span>
            </li>
            <li>
              <span>Performances</span>
              <span>{descriptor.occurrenceCount}</span>
            </li>
          </ul>
        ) : (
          <p className="muted">{status ?? "Loading the published plan."}</p>
        )}

        {availability ? (
          <p className="muted">
            {availability.freeCount} seats are free for every performance in the plan,{" "}
            {availability.blockedCount} are not.
          </p>
        ) : null}

        {handoff ? (
          <div>
            <p className="total">
              <span>Held</span>
              <span>{handoff.allocations.length} performances</span>
            </p>
            <p className="muted small">Operation id: {handoff.operationId}</p>
            <p className="muted">
              The handoff carries no price. Your server inspects the operation, prices the
              package, charges through your own payment gateway, then books it.
            </p>
            <div className="actions">
              <button
                type="button"
                onClick={() => {
                  void pickerRef.current?.release(newActionId());
                  setHandoff(null);
                }}
              >
                Release the package
              </button>
            </div>
          </div>
        ) : null}

        <h2>Returning holder</h2>
        <p className="muted">
          A holder who already has these seats renews from an offer your server issued.
          Recording intent does not confirm a price or take payment.
        </p>
        <label className="field">
          <span>Renewal offer id</span>
          <input
            type="text"
            value={offerId}
            placeholder="sro_..."
            onChange={(event) => setOfferId(event.target.value)}
          />
        </label>
        <div className="actions">
          <button
            type="button"
            disabled={offerId.trim().length === 0}
            onClick={() => void recordRenewalIntent()}
          >
            Record renewal intent
          </button>
        </div>
        {renewal ? (
          <p className="muted small">
            Intent {renewal.intentId} recorded, state {renewal.state}.
          </p>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
      </aside>
    </div>
  );
}
