"use client";

import { forwardRef } from "react";
import { SeatPicker } from "@seatlayer/react";
import type { CheckoutHandoff, HoldResult, SeatPickerHandle } from "@seatlayer/react";
import { currency, eventKey, publicKey } from "@/lib/config";

interface PickerWidgetProps {
  onHoldChange: (hold: HoldResult | null) => void;
  onCheckout: (handoff: CheckoutHandoff) => void;
  onHoldExpired: () => void;
  onError: (message: string) => void;
}

/**
 * SeatPicker is the complete buyer experience: map, price panel, selection
 * tray, hold countdown and checkout button, all inside one component.
 */
export const PickerWidget = forwardRef<SeatPickerHandle, PickerWidgetProps>(function PickerWidget(
  { onHoldChange, onCheckout, onHoldExpired, onError },
  ref,
) {
  return (
    <SeatPicker
      ref={ref}
      event={eventKey}
      publicKey={publicKey}
      currency={currency}
      maxSelection={8}
      className="seatmap"
      onHoldChange={(hold) => onHoldChange(hold)}
      onCheckout={(_hold, _seats, handoff) => onCheckout(handoff)}
      onHoldExpired={onHoldExpired}
      onError={(cause) =>
        onError(cause instanceof Error ? cause.message : "The seat picker could not load")
      }
    />
  );
});
