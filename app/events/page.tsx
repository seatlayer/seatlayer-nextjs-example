import { RouteIntro } from "@/components/RouteIntro";
import { EventSwitcher } from "@/components/EventSwitcher";

export default function Page() {
  return (
    <>
      <RouteIntro
        title="Several events on one page"
        question="How do I show several events on one page and swap the seat map when the buyer picks a different date?"
        docsHref="https://docs.seatlayer.io/server-api/events/"
        docsLabel="Events API"
      />
      <EventSwitcher />
    </>
  );
}
