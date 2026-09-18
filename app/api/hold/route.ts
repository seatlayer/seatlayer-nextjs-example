import { NextResponse } from "next/server";

/**
 * Server side checkout stub.
 *
 * This is where a real integration does the trusted half of the flow:
 *
 *   1. Inspect the hold with a SeatLayer server SDK and your secret key, so the
 *      price comes from the server rather than from the browser.
 *   2. Create your own checkout session for that amount with your own payment
 *      gateway.
 *   3. Book the hold once payment succeeds, reusing your own order id as the
 *      booking reference so a retry is idempotent.
 *
 * Server SDK reference: https://docs.seatlayer.io/server-sdk/
 * Holds and checkout: https://docs.seatlayer.io/buyer-sdk/holds-and-checkout/
 *
 * A secret key belongs only in code like this, never in a client component.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { holdId?: string } | null;
  const holdId = body?.holdId;

  if (!holdId) {
    return NextResponse.json({ error: "holdId is required" }, { status: 400 });
  }

  // const seatlayer = new SeatLayer(process.env.SEATLAYER_SECRET_KEY!);
  // const inspected = await seatlayer.holds.inspect(holdId);
  // const session = await yourPaymentGateway.createCheckoutSession(inspected);
  // return NextResponse.json({ checkoutUrl: session.url });

  return NextResponse.json({
    ok: true,
    holdId,
    next: "Inspect this hold on the server, charge for it, then book it.",
  });
}
