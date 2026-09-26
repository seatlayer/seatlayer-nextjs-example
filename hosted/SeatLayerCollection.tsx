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
  /**
   * Bring buyers back to this page after a payment that redirects, such as
   * Stripe. Your site must be listed under Embed domains in the dashboard;
   * otherwise buyers finish on the SeatLayer event page.
   */
  returnToPage?: boolean;
}

/**
 * Every upcoming public event in one workspace, listed on your page. Buyers
 * pick a date, then their seats. Only events you list publicly appear.
 * Try it live: https://seatlayer.io/demo/hosted/multi-date/
 */
export function SeatLayerCollection({ workspaceId, layout = "grid", fallbackUrl, returnToPage = false }: SeatLayerCollectionProps) {
  useEffect(() => {
    loadSeatLayerScript(COLLECTION_SRC, "SeatLayerCollections");
  }, [workspaceId]);

  return (
    <div
      key={workspaceId}
      data-seatlayer-collection={workspaceId}
      data-layout={layout === "grid" ? undefined : layout}
      data-return-url={returnToPage ? "page" : undefined}
    >
      <a className="slc-fallback" href={fallbackUrl}>
        View tickets on SeatLayer
      </a>
    </div>
  );
}
