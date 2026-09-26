Try it live: https://seatlayer.io/demo

# SeatLayer examples for Next.js: sell reserved seats with one tag, or build the seat map into your app

Open source (MIT) example code for the two ways to sell reserved seats with
SeatLayer:

- **Hosted**: paste one tag into any website. SeatLayer runs the seat map, the
  payment through your own gateway, and the tickets.
- **SDK**: put the seat map inside your own React or Next.js app. SeatLayer holds
  the seats, and your own checkout takes the payment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seatlayer/seatlayer-nextjs-example)

## Hosted: one tag

The whole integration is one block of HTML. Replace `<YOUR_EVENT_KEY>` with the
key from your event's page in the dashboard.

```html
<div
  data-seatlayer-event="<YOUR_EVENT_KEY>"
  data-layout="picker"
  data-checkout="hosted"
  data-height="740px"
  data-fallback-url="https://app.seatlayer.io/e/<YOUR_EVENT_KEY>">
  <a href="https://app.seatlayer.io/e/<YOUR_EVENT_KEY>">Book tickets on SeatLayer</a>
</div>
<script src="https://app.seatlayer.io/sl-event-widget@0.js" defer></script>
```

It works on WordPress, Wix, Squarespace, Webflow and any HTML page. Copy-paste
versions are in [`examples/hosted/`](./examples/hosted), and React components
that render the same tags are in [`hosted/`](./hosted):

| What you want | HTML | React | Live demo |
| --- | --- | --- | --- |
| A seat map for one event | [`event.html`](./examples/hosted/event.html) | [`SeatLayerEvent`](./hosted/SeatLayerEvent.tsx) | [Paid event](https://seatlayer.io/demo/hosted/paid-event/), [Free event](https://seatlayer.io/demo/hosted/free-event/), [Standing + tables](https://seatlayer.io/demo/hosted/standing-and-tables/), [3D view](https://seatlayer.io/demo/hosted/3d-view/) |
| Every upcoming date, then seats | [`collection.html`](./examples/hosted/collection.html) | [`SeatLayerCollection`](./hosted/SeatLayerCollection.tsx) | [Multi-date](https://seatlayer.io/demo/hosted/multi-date/) |
| A season ticket | [`season-card.html`](./examples/hosted/season-card.html) | [`BookingCard`](./hosted/BookingCard.tsx) | [Season ticket](https://seatlayer.io/demo/hosted/season-ticket/) |
| A run of shows | [`performance-card.html`](./examples/hosted/performance-card.html) | [`BookingCard`](./hosted/BookingCard.tsx) | [Performance groups](https://seatlayer.io/demo/hosted/performance-groups/) |

```tsx
import { SeatLayerEvent } from "./hosted/SeatLayerEvent";

<SeatLayerEvent
  eventKey="<YOUR_EVENT_KEY>"
  fallbackUrl="https://app.seatlayer.io/e/<YOUR_EVENT_KEY>"
/>;
```

The React components load each script once per page and render again after a
client-side route change.

## SDK: the seat map in your app

This repository is one small Next.js App Router app. Each route is one demo:

| Route | What it shows | Live demo |
| --- | --- | --- |
| `/seat-picker` | The complete `SeatPicker` buyer flow and what its `onCheckout` handoff gives your checkout | [Seat picker](https://seatlayer.io/demo/sdk/seat-picker) |
| `/best-available` | `bestAvailable()`: the best seats together for a party size, held in one call | [Best available](https://seatlayer.io/demo/sdk/best-available) |
| `/season-tickets` | `SeasonPicker`: one seat choice held for every performance in a season | [Season tickets](https://seatlayer.io/demo/sdk/season-tickets) |
| `/multiple-events` | Several events on one page with one `SeatingChart`, from your own event list | [Multiple events](https://seatlayer.io/demo/sdk/multiple-events) |
| `/checkout-handoff` | Your own cart, then your server reads the hold back and books it (`app/api/hold/route.ts`) | [Checkout handoff](https://seatlayer.io/demo/sdk/checkout-handoff) |

Two more routes are not in the menu: `/control-room` shows `SeatManager`, the
staff board, behind an event-scoped `mse_` token, and `/html` serves the seat
picker as a plain HTML page with the script tag install
(`app/html/index.html`). Add `?embed=1` to any route to show only the example,
for use inside an iframe.

```sh
npm install @seatlayer/react
```

```tsx
"use client";
import { SeatPicker } from "@seatlayer/react";

<SeatPicker
  event="<YOUR_EVENT_KEY>"
  publicKey="pk_test_..."
  currency="EUR"
  style={{ width: "100%", height: 740 }}
  onCheckout={(_hold, _seats, handoff) => startCheckout({ holdId: handoff.holdId })}
/>;
```

Send only the `holdId` to your server. Your server reads the seats and prices
back from SeatLayer with your secret key, charges through your own payment
gateway, and books the hold with your own order id as the booking reference.

## Where to find your keys

Sign in at [app.seatlayer.io](https://app.seatlayer.io). Test mode is free and
needs no card.

| Key | Where | Looks like | Used for |
| --- | --- | --- | --- |
| Publishable key | Dashboard → Developer | `pk_test_...` | Browser code (SDK) |
| Secret key | Dashboard → Developer | `sk_test_...` | Your server only. Never in browser code |
| Event key | The top of the event's page | `ev_...` or your own slug | Hosted tag and SDK |
| Season key | The season's Sell tab, in its booking link | `sea_...` | Season tickets |
| Workspace id | In your dashboard address (`/w/ws_.../`) and in the multiple events code on an event's publish page | `ws_...` | The hosted collection |

The event key is not the `pk_` key. If the seat map says the event was not
found, check that you pasted the event key into the event field.

## Run it locally

```sh
npm install
cp .env.example .env.local   # add your keys
npm run dev
```

Then open http://localhost:3000.

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SEATLAYER_EVENT_KEY` | Every SDK route |
| `NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY` | Every SDK route |
| `NEXT_PUBLIC_SEATLAYER_EVENT_KEY_2`, `_3` | More events on `/multiple-events` (optional) |
| `NEXT_PUBLIC_SEATLAYER_SEASON_KEY` | `/season-tickets` |
| `NEXT_PUBLIC_SEATLAYER_CURRENCY` | Prices before a hold, for example `EUR` (defaults to `EUR`) |
| `SEATLAYER_SECRET_KEY` | The server steps on `/checkout-handoff` and real event names (optional, server only) |
| `SEATLAYER_BASE_PATH` | Serve the app under a sub-path such as `/demos` (optional, set at build and start) |

Every route shows a setup notice instead of a chart until its keys are present,
so the app runs the moment it is cloned. `npm run build` and `npm start` give
you a production build on any Node host.

## Questions this repo answers

### How do I embed an interactive seating chart in Next.js?

Render `SeatPicker` or `SeatingChart` from `@seatlayer/react` inside a client
component, loaded with `next/dynamic` and `ssr: false`. Give the wrapping
element a definite height, because the chart fills its box. See
`components/PickerWidget.tsx` and `components/SeatMap.tsx`.

### How do I stop two buyers taking the same seat?

Hold the seats. A hold is a short claim on inventory, and each event processes
holds one at a time, so two buyers cannot both hold one seat. `hold()` resolves
to null when the seats were taken in between, so you can ask the buyer to
choose again. The hold carries an absolute `expiresAt` to count down from. See
`components/SeatSelection.tsx` and `components/HoldCountdown.tsx`.

### How do I hand a hold to my own checkout and payment gateway?

The browser sends only the hold id. Your route handler reads the hold back from
SeatLayer, which is where the real seats and prices come from, charges through
your own gateway, and books the hold with your own order id. Repeating a request
with the same order id cannot sell twice. See `app/api/hold/route.ts`.

### How do I sell season tickets?

Use `SeasonPicker` with a published season key. The buyer keeps the same seats
for every performance, and the hold covers all of them or none. The handoff
carries no price: your server prices the package. Returning holders renew from
an offer your server issued with `createRenewalIntent(offerId)`, which records
intent only. See `components/SeasonFlow.tsx`.

### How do I offer best available seats for a group?

Call `bestAvailable(quantity, categoryKey?)` on the chart handle. It finds the
best block of seats together and holds it in the same call, or resolves to null
when no block of that size is free, which is not the same as sold out. See
`components/BestAvailableFlow.tsx`.

### Can I use this with Vue or Angular?

Yes. The same engine ships as `@seatlayer/vue`, `@seatlayer/angular` and the
framework-free `@seatlayer/js`, with the same options and the same server
boundary. See the [Vue](https://docs.seatlayer.io/buyer-sdk/vue/) and
[Angular](https://docs.seatlayer.io/buyer-sdk/angular/) guides.

### Does it handle a 100,000-seat stadium?

Yes. Open the [200,000-seat stadium demo](https://app.seatlayer.io/demo/play/century-stadium-200k)
and drive it yourself. How the renderer is measured is written up in
[renderer performance](https://docs.seatlayer.io/platform/renderer-performance/).

## Documentation

- [Install the Buyer SDK](https://docs.seatlayer.io/buyer-sdk/install/)
- [Add a seat map to a React app](https://docs.seatlayer.io/buyer-sdk/react-seating-chart/)
- [SeatPicker reference](https://docs.seatlayer.io/buyer-sdk/seat-picker/)
- [Season picker](https://docs.seatlayer.io/buyer-sdk/seasons/)
- [Holds and checkout handoff](https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/)
- [Best available seats](https://docs.seatlayer.io/buyer-sdk/best-available/)
- [Node server SDK](https://docs.seatlayer.io/server-sdk/node/)
- [Pricing](https://seatlayer.io/pricing/)

## License

MIT. See [LICENSE](./LICENSE).
