import { RouteIntro } from "@/components/RouteIntro";
import { SeasonFlow } from "@/components/SeasonFlow";

export default function Page() {
  return (
    <>
      <RouteIntro
        title="Season tickets with seat selection"
        question="How do I sell season tickets, where one choice of seats covers every performance in a published plan and returning holders can renew?"
        docsHref="https://docs.seatlayer.io/buyer-sdk/seasons/"
        docsLabel="Season picker"
      />
      <SeasonFlow />
    </>
  );
}
