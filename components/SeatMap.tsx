"use client";

import { forwardRef } from "react";
import { SeatingChart } from "@seatlayer/react";
import type { HoldResult, SeatingChartHandle, SelectedSeat } from "@seatlayer/react";
import { currency, eventKey, publicKey } from "@/lib/config";

interface SeatMapProps {
  onSelectionChange: (seats: SelectedSeat[]) => void;
  onHold: (hold: HoldResult) => void;
  onHoldExpired: () => void;
  onError: (message: string) => void;
}

/**
 * SeatingChart is the headless canvas: it draws the venue and owns live
 * availability, while this application owns the totals, the buttons and the
 * checkout handoff.
 */
export const SeatMap = forwardRef<SeatingChartHandle, SeatMapProps>(function SeatMap(
  { onSelectionChange, onHold, onHoldExpired, onError },
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
