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
 * The route shows only the events you configure, never your whole account.
 * Without a secret key it serves them with the placeholder names below. When
 * SEATLAYER_SECRET_KEY is present it reads each event's real name with the
 * Node server SDK. A secret key only ever exists in a route handler like this
 * one: it is never sent to the browser, never logged, and never put in a
 * response.
 *
 * Events API: https://docs.seatlayer.io/server-api/events/
 * Node server SDK: https://docs.seatlayer.io/server-sdk/node/
 */
const staticEvents: EventOption[] = [
  { key: eventKey, name: "Opening night" },
  { key: process.env.NEXT_PUBLIC_SEATLAYER_EVENT_KEY_2 || eventKey, name: "Saturday matinee" },
  { key: process.env.NEXT_PUBLIC_SEATLAYER_EVENT_KEY_3 || eventKey, name: "Closing night" },
];

export async function GET() {
  const secretKey = process.env.SEATLAYER_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ events: staticEvents, source: "static" });
  }

  try {
    const { SeatLayer } = await import("@seatlayer/server");
    const seatlayer = new SeatLayer(secretKey);

    // Each configured key once, named as it is in SeatLayer.
    const keys = [...new Set(staticEvents.map((event) => event.key))];
    const events: EventOption[] = await Promise.all(
      keys.map(async (key) => {
        const event = await seatlayer.events.retrieve(key);
        return { key, name: event.meta.name };
      }),
    );

    return NextResponse.json({ events, source: "server-sdk" });
  } catch {
    // The key is never included in the message a browser can read.
    return NextResponse.json({ events: staticEvents, source: "static" });
  }
}
