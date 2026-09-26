"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { formatClock } from "@/lib/money";

interface HoldCountdownProps {
  /** Epoch milliseconds the hold expires, straight from the server. */
  expiresAt: number;
  onExpired: () => void;
}

/**
 * Counts down from the server's expiry timestamp rather than from a duration
 * invented in the browser.
 */
export function HoldCountdown({ expiresAt, onExpired }: HoldCountdownProps) {
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    setRemaining(expiresAt - Date.now());
    const timer = window.setInterval(() => {
      const next = expiresAt - Date.now();
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(timer);
        onExpired();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, onExpired]);

  return (
    <p className="countdown">
      <Icon name="clock" />
      Seats held for <strong className="mono">{formatClock(remaining)}</strong>
    </p>
  );
}
