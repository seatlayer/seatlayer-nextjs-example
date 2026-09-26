"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { SeasonCheckoutHandoff, SeasonDescriptor, SeasonPickerHandle } from "@seatlayer/react";
import { HandoffTable } from "@/components/HandoffTable";
import { SetupNotice } from "@/components/SetupNotice";
import { isSeasonConfigured } from "@/lib/config";

const SeasonWidget = dynamic(() => import("@/components/SeasonWidget").then((m) => m.SeasonWidget), {
  ssr: false,
  loading: () => <p className="demo-loading">Loading the season</p>,
});

/**
 * Season tickets: one seat choice held across every performance.
 *
 * Returning holders renew from an offer your server issued: call
 * `pickerRef.current.createRenewalIntent(offerId)` with the `sro_` offer id.
 * That records intent only. It never confirms a price or takes payment, so it
 * belongs in your own account area rather than on a public page.
 */
export function SeasonFlow() {
  const pickerRef = useRef<SeasonPickerHandle>(null);
  const [descriptor, setDescriptor] = useState<SeasonDescriptor | null>(null);
  const [handoff, setHandoff] = useState<SeasonCheckoutHandoff | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isSeasonConfigured) {
    return <SetupNotice variables={["NEXT_PUBLIC_SEATLAYER_SEASON_KEY", "NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY"]} />;
  }

  return (
    <>
      <section className="demo-frame" aria-label="Season tickets demo">
        <SeasonWidget
          ref={pickerRef}
          onStatusChange={(event) => {
            if (event.kind === "ready") setDescriptor(pickerRef.current?.getDescriptor() ?? null);
          }}
          onHandoff={(next) => {
            setError(null);
            setHandoff(next);
          }}
          onHoldExpired={() => {
            setHandoff(null);
            setError("The season hold ran out. Choose your seats again.");
          }}
          onError={setError}
        />
      </section>
      {error ? <p className="error">{error}</p> : null}
      <HandoffTable
        title="What your checkout gets"
        note="After the buyer continues"
        empty={
          descriptor
            ? `Pick seats for ${descriptor.name} and continue. What your checkout receives appears here.`
            : "Pick seats and continue. What your checkout receives appears here."
        }
        rows={
          handoff
            ? [
                { field: "operationId", value: "The season hold. Send only this to your server." },
                {
                  field: "allocations",
                  value: `${handoff.allocations.length} performances, the same seats in each`,
                },
                { field: "price", value: "None. Your server prices the package, then books it." },
              ]
            : null
        }
      />
    </>
  );
}
