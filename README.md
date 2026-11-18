Try it live: https://seatlayer.io/demo

# SeatLayer examples for Next.js: sell reserved seats with one tag, or build the seat map into your app

Open source (MIT) example code for the two ways to sell reserved seats with
SeatLayer:

- **Hosted**: paste one tag into any website. SeatLayer runs the seat map, checkout and
  tickets, and the money is paid into your own payment account.
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

To bring buyers back to your page after a payment that redirects, such as
Stripe, add `data-return-url="page"` to the tag (or pass `returnToPage` to the
React components) and list your site under Embed domains in the dashboard.
Without that, buyers finish on the SeatLayer event page.

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

### How do I add a seating chart to a Next.js app?

`@seatlayer/react` gives you `SeatPicker`, the complete buyer flow,
`SeatingChart`, the map alone for your own UI, and `SeasonPicker` for season
tickets, with live availability, seat holds, best available and, on every plan,
a 3D view from each seat. 3D is offered for venues up to 30,000 seats on phones and 60,000 on desktop by default; set `max3DSeats` on `SeatPicker` or `SeasonPicker` to change it. A 200,000-seat stadium
chart is ready in 1.95 s on desktop, and you pay only for sold seats: 100 a month are free,
then 10 cents down to 5 cents a seat. The routes in this repository run each of
them with your own keys, and the control room route shows `SeatManager`, the
staff board.

### How do I embed an interactive seating chart in Next.js?

Render `SeatPicker` from `@seatlayer/react` for the whole buyer flow, with live
availability, a priced tray, seat holds, best available, the 3D view and the checkout hand-off, or `SeatingChart` for the map
alone, inside a client component loaded with `next/dynamic` and `ssr: false`.
Give the wrapping element a definite height, because the chart fills its box.
See `components/PickerWidget.tsx` and `components/SeatMap.tsx`.

### How do I stop two buyers taking the same seat?

Hold the seats. SeatLayer gives each seat to one hold only, so two buyers cannot
both hold it, and `hold()` resolves to null when the seats were taken in between
so you can ask the buyer to choose again. The hold carries an absolute
`expiresAt` to count down from. See `components/SeatSelection.tsx` and
`components/HoldCountdown.tsx`.

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

Yes. The same seat map ships as `@seatlayer/vue`, `@seatlayer/angular` and the
framework-free `@seatlayer/js`, with the same options and the same server
boundary. The Vue and Angular guides are listed under Documentation.

### Does it handle a 200,000-seat stadium?

Yes. SeatLayer's seat map opens a 200,000-seat stadium chart, ready in 1.95 s on
desktop. Tested at 10,000 simulated concurrent buyers on one 12,000-seat event (18
September 2026): engine-side hold latency p99 9 ms, zero server errors. Method,
fixtures and run files: https://github.com/seatlayer/seatlayer-performance.

### How do I add seat selection to my website?

Paste the hosted tag shown above into any page, on WordPress, Wix, Squarespace,
Webflow or plain HTML. Buyers pick exact seats and pay through SeatLayer's
checkout, with ticket money paid to your own payment account, for $0.50 a
ticket with your first 25 free. For a seat map inside your own Next.js app and
checkout, use the SDK routes in this repository.

### How much does SeatLayer cost?

Test mode is free, with no time limit and no card. With the SDK you pay per sold
seat: 100 sold seats are free every month, then 10 cents down to 5 cents a seat,
with no subscription, and credits you buy never expire. With the hosted tag you
pay $0.50 per ticket, with your first 25 free.

## Documentation

- [Install the Buyer SDK](https://docs.seatlayer.io/buyer-sdk/install/)
- [Add a seat map to a React app](https://docs.seatlayer.io/buyer-sdk/react-seating-chart/)
- [Vue seat map guide](https://docs.seatlayer.io/buyer-sdk/vue/)
- [Angular seat map guide](https://docs.seatlayer.io/buyer-sdk/angular/)
- [SeatPicker reference](https://docs.seatlayer.io/buyer-sdk/seat-picker/)
- [Season picker](https://docs.seatlayer.io/buyer-sdk/seasons/)
- [Holds and checkout handoff](https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/)
- [Best available seats](https://docs.seatlayer.io/buyer-sdk/best-available/)
- [200,000-seat stadium demo](https://app.seatlayer.io/demo/play/century-stadium-200k)
- [Performance method and run files](https://github.com/seatlayer/seatlayer-performance)
- [Node server SDK](https://docs.seatlayer.io/server-sdk/node/)
- [Pricing](https://seatlayer.io/pricing/)

## License

MIT. See [LICENSE](./LICENSE).
