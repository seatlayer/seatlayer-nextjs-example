"use client";

import { useEffect } from "react";
import { loadSeatLayerScript } from "./loadScript";

const WIDGET_SRC = "https://app.seatlayer.io/sl-event-widget@0.js";

interface SeatLayerEventProps {
  /** Your event key, from the event's page in the dashboard. */
  eventKey: string;
  /**
   * "picker" puts the seat map on your page. "card", "banner" and "button"
   * show a smaller block that opens the seat map when clicked.
   */
  layout?: "picker" | "card" | "banner" | "button";
  /** CSS height of the seat map when layout is "picker". */
  height?: string;
  /** Where buyers go if the script cannot load: your event's booking page. */
  fallbackUrl: string;
}

/**
 * Hosted Ticketing in React: the same one tag as the HTML version. SeatLayer
 * runs the seat map, the payment through your own gateway and the tickets.
 * Try it live: https://seatlayer.io/demo/hosted/paid-event/
 */
export function SeatLayerEvent({ eventKey, layout = "picker", height = "740px", fallbackUrl }: SeatLayerEventProps) {
  useEffect(() => {
    loadSeatLayerScript(WIDGET_SRC, "SeatLayerEvents");
  }, [eventKey]);

  return (
    <div
      key={eventKey}
      data-seatlayer-event={eventKey}
      data-layout={layout}
      data-checkout="hosted"
      data-height={layout === "picker" ? height : undefined}
      data-fallback-url={fallbackUrl}
    >
      <a href={fallbackUrl}>Book tickets on SeatLayer</a>
    </div>
  );
}
