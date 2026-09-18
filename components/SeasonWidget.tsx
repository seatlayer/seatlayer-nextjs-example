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
      className="seatmap"
      offer={{
        eyebrow: "2027 membership",
        priceLabel: "From $480",
        compareAtPriceLabel: "From $600 bought separately",
        savingsLabel: "Save $120",
        priceNote: "The package price depends on your seats and is confirmed at checkout",
        benefits: ["Priority entry", "Free ticket exchange", "Renewal priority"],
        renewalLabel: "Same-seat renewal eligible",
      }}
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
