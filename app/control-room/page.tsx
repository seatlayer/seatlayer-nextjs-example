import { RouteIntro } from "@/components/RouteIntro";
import { ControlRoom } from "@/components/ControlRoom";

export default function Page() {
  return (
    <>
      <RouteIntro
        title="The organizer board"
        question="How do staff watch live inventory for one event without an account in my product and without a secret key in the browser?"
        docsHref="https://docs.seatlayer.io/platform/embedded-control-room/"
        docsLabel="Embedded Control Room"
      />
      <ControlRoom />
    </>
  );
}
