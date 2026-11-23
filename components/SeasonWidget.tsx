"use client";

import { forwardRef } from "react";
import { SeasonPicker } from "@seatlayer/react";
import type {
  SeasonCheckoutHandoff,
  SeasonPickerHandle,
  SeasonStatusEvent,
} from "@seatlayer/react";
import { publicKey, seasonKey } from "@/lib/config";

interface SeasonWidgetProps {
  onStatusChange: (event: SeasonStatusEvent) => void;
  onHandoff: (handoff: SeasonCheckoutHandoff) => void;
  onHoldExpired: () => void;
  onError: (message: string) => void;
}

/**
 * The fixed-inclusion Season buyer journey. One choice of seats covers every
 * performance in the published plan, and the hold is all or nothing.
 */
export const SeasonWidget = forwardRef<SeasonPickerHandle, SeasonWidgetProps>(function SeasonWidget(
  { onStatusChange, onHandoff, onHoldExpired, onError },
  ref,
) {
  return (
    <SeasonPicker
      ref={ref}
      season={seasonKey}
      publicKey={publicKey}
      maxSelection={4}
      className="seatmap seatmap--season"
      onStatusChange={onStatusChange}
      onHold={onHandoff}
      onContinue={onHandoff}
      onHoldExpired={onHoldExpired}
      onAccessUnavailable={(event) =>
        onError(`This season is not open for public selection (${event.reason}).`)
      }
      onError={(cause) =>
        onError(cause instanceof Error ? cause.message : "The season could not load")
      }
    />
  );
});
