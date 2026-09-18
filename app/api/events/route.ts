import { NextResponse } from "next/server";
import { eventKey } from "@/lib/config";

export const dynamic = "force-dynamic";

export interface EventOption {
  key: string;
  name: string;
}

/**
 * The event list for the multiple events page.
 *
 * Static configuration keeps the repository runnable with a single event. When
 * SEATLAYER_SECRET_KEY is present the same route reads the real catalogue with
 * the Node server SDK instead. A secret key only ever exists in a route handler
 * like this one: it is never sent to the browser, never logged, and never put
 * in a response.
 *
 * Events API: https://docs.seatlayer.io/server-api/events/
 * Node server SDK: https://docs.seatlayer.io/server-sdk/node/
 */
const staticEvents: EventOption[] = [
  { key: eventKey, name: "Opening night" },
  { key: process.env.NEXT_PUBLIC_SEATLAYER_EVENT_KEY_2 ?? eventKey, name: "Saturday matinee" },
  { key: process.env.NEXT_PUBLIC_SEATLAYER_EVENT_KEY_3 ?? eventKey, name: "Closing night" },
];

export async function GET() {
  const secretKey = process.env.SEATLAYER_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ events: staticEvents, source: "static" });
  }

  try {
    const { SeatLayer } = await import("@seatlayer/server");
    const seatlayer = new SeatLayer(secretKey);

    const events: EventOption[] = [];
    for await (const event of seatlayer.events.listAll()) {
      events.push({ key: event.key, name: event.name });
      if (events.length >= 12) break;
    }

    return NextResponse.json({ events, source: "server-sdk" });
  } catch {
    // The key is never included in the message a browser can read.
    return NextResponse.json({ events: staticEvents, source: "static" });
  }
}
