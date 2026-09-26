"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { SelectionSummary } from "@/components/SelectionSummary";
import { SetupNotice } from "@/components/SetupNotice";
import { isConfigured } from "@/lib/config";
import type { EventOption } from "@/app/api/events/route";

const EventChart = dynamic(() => import("@/components/EventChart").then((m) => m.EventChart), {
  ssr: false,
  loading: () => <p className="muted">Loading the seat map</p>,
});

/**
 * One page, several events, one chart.
 *
 * Each event has its own inventory, so the chart is rebuilt when the buyer
 * switches. Any open hold belongs to the event it was created on: release it
 * first, otherwise those seats stay off the market until they expire.
 */
export function EventSwitcher() {
  const chartRef = useRef<SeatingChartHandle>(null);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selected, setSelected] = useState<EventOption | null>(null);
  const [seats, setSeats] = useState<SelectedSeat[]>([]);
  const [hold, setHold] = useState<HoldResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/events")
      .then((response) => response.json())
      .then((payload: { events: EventOption[] }) => {
        if (!active) return;
        setEvents(payload.events);
        setSelected(payload.events[0] ?? null);
      })
      .catch(() => setError("The event list could not be loaded."));
    return () => {
      active = false;
    };
  }, []);

  async function switchEvent(next: EventOption) {
    setError(null);
    if (hold) {
      await chartRef.current?.release();
      setHold(null);
    }
    setSeats([]);
    setSelected(next);
  }

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  const total = seats.reduce((sum, seat) => sum + (seat.price ?? 0), 0);

  return (
    <div className="layout">
      <section className="map-panel">
        <div className="event-list" role="group" aria-label="Events">
          {events.map((option, index) => (
            <button
              key={`${option.key}-${index}`}
              type="button"
              className={option === selected ? "chip active" : "chip"}
              onClick={() => void switchEvent(option)}
            >
              {option.name}
            </button>
          ))}
        </div>
        {selected ? (
          <EventChart
            key={selected.key}
            ref={chartRef}
            eventKey={selected.key}
            onSelectionChange={setSeats}
            onHold={setHold}
            onHoldExpired={() => setHold(null)}
            onError={setError}
          />
        ) : (
          <p className="muted">Loading the event list</p>
        )}
      </section>

      <aside className="cart-panel">
        <h2>{selected?.name ?? "Events"}</h2>
        <SelectionSummary seats={seats} total={total} />
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button
            type="button"
            className="primary"
            disabled={seats.length === 0}
            onClick={() => void chartRef.current?.hold().then(setHold)}
          >
            Hold these seats
          </button>
        </div>
        {hold ? <p className="muted small">Hold id: {hold.holdId}</p> : null}
        <p className="muted">
          The list comes from <code>app/api/events/route.ts</code>, which shows the events
          you configure and reads their real names with the server SDK when a secret key is
          present.
        </p>
      </aside>
    </div>
  );
}
