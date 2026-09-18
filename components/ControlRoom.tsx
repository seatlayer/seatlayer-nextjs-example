"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type {
  EventScopedManageToken,
  SeatManagerConnection,
  SeatManagerTallies,
} from "@seatlayer/react/manager";
import { SetupNotice } from "@/components/SetupNotice";
import { isConfigured } from "@/lib/config";

const ManagerBoard = dynamic(() => import("@/components/ManagerBoard").then((m) => m.ManagerBoard), {
  ssr: false,
  loading: () => <p className="muted">Loading the board</p>,
});

function isManageToken(value: string): value is EventScopedManageToken {
  return value.startsWith("mse_");
}

/**
 * The organizer board.
 *
 * `SeatManager` needs a short-lived, event-scoped `mse_` grant that your own
 * backend mints after it has authenticated a member of staff. A secret key is
 * never accepted here and must never reach a browser. The token typed below is
 * kept in component state for the life of the page and is never written to
 * storage, a URL or a log.
 */
export function ControlRoom() {
  const [draft, setDraft] = useState("");
  const [token, setToken] = useState<EventScopedManageToken | null>(null);
  const [tallies, setTallies] = useState<SeatManagerTallies | null>(null);
  const [connection, setConnection] = useState<SeatManagerConnection | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openBoard() {
    const value = draft.trim();
    if (!isManageToken(value)) {
      setError("An event-scoped manage token starts with mse_.");
      return;
    }
    setError(null);
    setToken(value);
    setDraft("");
  }

  if (!isConfigured) {
    return (
      <SetupNotice
        variables={["NEXT_PUBLIC_SEATLAYER_EVENT_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]}
      />
    );
  }

  if (!token) {
    return (
      <section className="setup">
        <h2>Paste an event-scoped manage token</h2>
        <p>
          Your backend mints this token for one event after it authenticates a member of staff.
          It is short lived, it is not stored by this page, and it is not a secret key.
        </p>
        <label className="field">
          <span>Manage token</span>
          <input
            type="password"
            value={draft}
            placeholder="mse_..."
            autoComplete="off"
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
        <div className="actions">
          <button type="button" className="primary" onClick={openBoard}>
            Open the board
          </button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>
    );
  }

  return (
    <div className="layout">
      <section className="map-panel">
        <ManagerBoard
          token={token}
          onTallies={setTallies}
          onConnectionChange={setConnection}
          onError={setError}
        />
      </section>

      <aside className="cart-panel">
        <h2>Live inventory</h2>
        {tallies ? (
          <ul className="seat-list">
            <li>
              <span>Free</span>
              <span className="price">{tallies.free}</span>
            </li>
            <li>
              <span>Held</span>
              <span className="price">{tallies.held}</span>
            </li>
            <li>
              <span>Booked</span>
              <span className="price">{tallies.booked}</span>
            </li>
            <li>
              <span>Blocked</span>
              <span className="price">{tallies.blocked}</span>
            </li>
          </ul>
        ) : (
          <p className="muted">Waiting for the first snapshot.</p>
        )}
        {connection ? <p className="muted small">Realtime link: {connection.status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button type="button" onClick={() => setToken(null)}>
            Close the board
          </button>
        </div>
      </aside>
    </div>
  );
}
