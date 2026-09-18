"use client";

import { SeatManager } from "@seatlayer/react/manager";
import type {
  EventScopedManageToken,
  SeatManagerConnection,
  SeatManagerTallies,
} from "@seatlayer/react/manager";
import { currency, eventKey } from "@/lib/config";

interface ManagerBoardProps {
  token: EventScopedManageToken;
  onTallies: (tallies: SeatManagerTallies) => void;
  onConnectionChange: (state: SeatManagerConnection) => void;
  onError: (message: string) => void;
}

/**
 * `mode="view"` is the read-only live board. The tools list keeps it that way:
 * blocking, categories, tables and channels are left out, and the token's own
 * capabilities remain the real gate.
 */
export function ManagerBoard({ token, onTallies, onConnectionChange, onError }: ManagerBoardProps) {
  return (
    <SeatManager
      eventKey={eventKey}
      token={token}
      mode="view"
      tools={["view", "inspect"]}
      currency={currency}
      className="seatmap"
      onTallies={onTallies}
      onConnectionChange={onConnectionChange}
      onError={(cause) =>
        onError(cause instanceof Error ? cause.message : "The board could not load")
      }
    />
  );
}
