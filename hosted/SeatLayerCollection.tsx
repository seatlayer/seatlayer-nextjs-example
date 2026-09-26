"use client";

import { useEffect } from "react";
import { loadSeatLayerScript } from "./loadScript";

const COLLECTION_SRC = "https://app.seatlayer.io/sl-event-collection@0.js";

interface SeatLayerCollectionProps {
  /** Your workspace id (ws_...), from the dashboard. */
  workspaceId: string;
  layout?: "grid" | "list" | "calendar";
  /** Where buyers go if the script cannot load. */
  fallbackUrl: string;
}

/**
 * Every upcoming public event in one workspace, listed on your page. Buyers
 * pick a date, then their seats. Only events you list publicly appear.
 * Try it live: https://seatlayer.io/demo/hosted/multi-date/
 */
export function SeatLayerCollection({ workspaceId, layout = "grid", fallbackUrl }: SeatLayerCollectionProps) {
  useEffect(() => {
    loadSeatLayerScript(COLLECTION_SRC, "SeatLayerCollections");
  }, [workspaceId]);

  return (
    <div
      key={workspaceId}
      data-seatlayer-collection={workspaceId}
      data-layout={layout === "grid" ? undefined : layout}
    >
      <a className="slc-fallback" href={fallbackUrl}>
        View tickets on SeatLayer
      </a>
    </div>
  );
}
