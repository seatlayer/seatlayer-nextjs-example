import { RouteIntro } from "@/components/RouteIntro";
import { SeatPickerFlow } from "@/components/SeatPickerFlow";

export default function Page() {
  return (
    <>
      <RouteIntro
        title="The ready-made buyer flow"
        question="How do I let buyers pick seats and hold them so two people cannot buy the same seat, without building a tray, a price panel and a countdown myself?"
        docsHref="https://docs.seatlayer.io/buyer-sdk/seat-picker/"
        docsLabel="SeatPicker reference"
      />
      <SeatPickerFlow />
    </>
  );
}
