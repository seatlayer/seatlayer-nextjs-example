import { RouteIntro } from "@/components/RouteIntro";
import { BestAvailableFlow } from "@/components/BestAvailableFlow";

export default function Page() {
  return (
    <>
      <RouteIntro
        title="Best available seats for a group"
        question="How do I offer best available seats for a group, so a party of six is seated together without clicking six seats?"
        docsHref="https://docs.seatlayer.io/buyer-sdk/best-available/"
        docsLabel="Best available seats"
      />
      <BestAvailableFlow />
    </>
  );
}
