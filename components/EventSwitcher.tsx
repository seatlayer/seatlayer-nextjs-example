"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { HoldCountdown } from "@/components/HoldCountdown";
import { SelectionSummary } from "@/components/SelectionSummary";
import { SetupNotice } from "@/components/SetupNotice";
import { isConfigured } from "@/lib/config";
import { withBase } from "@/lib/site";
import type { EventOption } from "@/app/api/events/route";

const EventChart = dynamic(() => import("@/components/EventChart").then((m) => m.EventChart), {
  ssr: false,
  loading: () => <p className="demo-loading">Loading the seat map</p>,
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
    fetch(withBase("/api/events"))
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

  const expire = useCallback(() => {
    setHold(null);
    setError("The hold ran out. Pick your seats again.");
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

  async function holdSeats() {
    setError(null);
    const result = await chartRef.current?.hold();
    if (!result) {
      setError("Those seats were just taken. Please pick again.");
      return;
    }
    setHold(result);
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
    <section className="demo-frame demo-frame--bar" aria-label="Multiple events demo">
      <div className="demo-bar">
        <div className="event-tabs" role="group" aria-label="Events">
          {events.map((option, index) => (
            <button
              key={`${option.key}-${index}`}
              type="button"
              className="event-tab"
              aria-pressed={option === selected}
              onClick={() => void switchEvent(option)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
      {selected ? (
        <EventChart
          key={`${selected.key}-${events.indexOf(selected)}`}
          ref={chartRef}
          eventKey={selected.key}
          onSelectionChange={setSeats}
          onHold={setHold}
          onHoldExpired={expire}
          onError={setError}
        />
      ) : (
        <p className="demo-loading">Loading the event list</p>
      )}
      <div className="cart-bar">
        <div className="cart-bar-main">
          <b>{selected?.name ?? "Your seats"}</b>
          <SelectionSummary seats={seats} total={total} />
        </div>
        <div className="cart-bar-side">
          {hold ? <HoldCountdown expiresAt={hold.expiresAt} onExpired={expire} /> : null}
          {error ? <p className="error">{error}</p> : null}
          <button
            type="button"
            className="btn btn-amber"
            disabled={seats.length === 0 || hold !== null}
            onClick={() => void holdSeats()}
          >
            {hold ? "Seats held" : "Hold these seats"}
          </button>
        </div>
      </div>
    </section>
  );
}
