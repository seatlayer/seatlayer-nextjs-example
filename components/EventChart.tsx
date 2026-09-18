"use client";

import { forwardRef } from "react";
import { SeatingChart } from "@seatlayer/react";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { currency, publicKey } from "@/lib/config";

interface EventChartProps {
  eventKey: string;
  onSelectionChange: (seats: SelectedSeat[]) => void;
  onHold: (hold: HoldResult) => void;
  onHoldExpired: () => void;
  onError: (message: string) => void;
}

export const EventChart = forwardRef<SeatingChartHandle, EventChartProps>(function EventChart(
  { eventKey, onSelectionChange, onHold, onHoldExpired, onError },
  ref,
) {
  return (
    <SeatingChart
      ref={ref}
      event={eventKey}
      publicKey={publicKey}
      currency={currency}
      maxSelection={6}
      className="seatmap"
      onSelectionChange={onSelectionChange}
      onHold={onHold}
      onHoldExpired={onHoldExpired}
      onError={(cause) =>
        onError(cause instanceof Error ? cause.message : "The seat map could not load")
      }
    />
  );
});
