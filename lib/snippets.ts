/**
 * The code shown under each demo. Each sample is a trimmed copy of the file
 * named next to it, so a reader can go straight to the full version.
 */
export const serverHold = `// app/api/hold/route.ts (trimmed)
import { SeatLayer } from "@seatlayer/server";

export async function POST(request: Request) {
  const { holdId, orderId } = await request.json();
  const seatlayer = new SeatLayer(process.env.SEATLAYER_SECRET_KEY!);

  // Seats and prices come from SeatLayer, never from the browser.
  const hold = await seatlayer.inventory.retrieveHold(eventKey, holdId);
  if (hold.status !== "active") {
    return Response.json({ error: "hold_not_active" }, { status: 409 });
  }

  // Charge hold.items through your own payment gateway, then book
  // with your own order id so a retry can never sell twice.
  const booking = await seatlayer.inventory.book(eventKey, {
    holdId,
    labels: hold.items.map((item) => item.label),
    bookingRef: orderId,
  });
  return Response.json({ booked: booking.booked });
}`;

export const seatPicker = `"use client";
import { SeatPicker } from "@seatlayer/react";

export function Checkout() {
  return (
    <SeatPicker
      event="<YOUR_EVENT_KEY>"
      publicKey="pk_test_..."
      currency="EUR"
      style={{ width: "100%", height: 740 }}
      onCheckout={(_hold, _seats, handoff) => {
        // Send only the hold id to your server.
        startCheckout({ holdId: handoff.holdId });
      }}
    />
  );
}`;

export const bestAvailable = `"use client";
import { useRef } from "react";
import { SeatingChart, type SeatingChartHandle } from "@seatlayer/react";

export function BestAvailable() {
  const chart = useRef<SeatingChartHandle>(null);

  async function findSeats(quantity: number) {
    // Finds the best block of seats together and holds it in one call.
    const found = await chart.current?.bestAvailable(quantity);
    if (!found) return showMessage("No block that size is free right now.");
    startCheckout({ holdId: found.holdId });
  }

  return (
    <>
      <button onClick={() => findSeats(2)}>Find 2 seats</button>
      <SeatingChart ref={chart} event="<YOUR_EVENT_KEY>" publicKey="pk_test_..." />
    </>
  );
}`;

export const seasonTickets = `"use client";
import { SeasonPicker } from "@seatlayer/react";

export function SeasonTickets() {
  return (
    <SeasonPicker
      season="sea_..."
      publicKey="pk_test_..."
      style={{ width: "100%", height: 740 }}
      onContinue={(handoff) => {
        // One hold covers every performance in the season. The handoff
        // carries no price: your server prices the package.
        startCheckout({ operationId: handoff.operationId });
      }}
    />
  );
}`;

export const multipleEvents = `"use client";
import { useRef, useState } from "react";
import { SeatingChart, type SeatingChartHandle } from "@seatlayer/react";

export function EventPicker({ events }: { events: { key: string; name: string }[] }) {
  const chart = useRef<SeatingChartHandle>(null);
  const [current, setCurrent] = useState(events[0]);

  async function switchTo(next: typeof current) {
    await chart.current?.release(); // a hold belongs to its own event
    setCurrent(next);
  }

  return (
    <>
      {events.map((event) => (
        <button key={event.key} onClick={() => switchTo(event)}>{event.name}</button>
      ))}
      <SeatingChart key={current.key} ref={chart} event={current.key} publicKey="pk_test_..." />
    </>
  );
}`;

export const eventsRoute = `// app/api/events/route.ts (trimmed)
import { SeatLayer } from "@seatlayer/server";

export async function GET() {
  const seatlayer = new SeatLayer(process.env.SEATLAYER_SECRET_KEY!);
  const keys = ["<EVENT_KEY_1>", "<EVENT_KEY_2>", "<EVENT_KEY_3>"];
  const events = await Promise.all(
    keys.map(async (key) => {
      const event = await seatlayer.events.retrieve(key);
      return { key, name: event.meta.name };
    }),
  );
  return Response.json({ events });
}`;

export const ownCart = `"use client";
import { useRef, useState } from "react";
import { SeatingChart, type SeatingChartHandle } from "@seatlayer/react";

export function OwnCart() {
  const chart = useRef<SeatingChartHandle>(null);
  const [seats, setSeats] = useState([]);

  async function continueToCheckout() {
    const hold = await chart.current?.hold();
    if (!hold) return showMessage("Those seats were just taken.");
    // The browser sends only the hold id. Your server does the rest.
    await fetch("/api/hold", {
      method: "POST",
      body: JSON.stringify({ holdId: hold.holdId }),
    });
  }

  return (
    <>
      <SeatingChart ref={chart} event="<YOUR_EVENT_KEY>" publicKey="pk_test_..."
        onSelectionChange={setSeats} />
      <button disabled={!seats.length} onClick={continueToCheckout}>Continue to checkout</button>
    </>
  );
}`;
