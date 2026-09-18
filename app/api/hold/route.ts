import { NextResponse } from "next/server";
import { eventKey } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * The trusted half of the flow.
 *
 * The browser never sends a price and never books anything. It sends an opaque
 * hold id. This route:
 *
 *   1. Inspects the hold with the Node server SDK, so the seats and their
 *      prices come from SeatLayer rather than from the browser.
 *   2. Is where your own checkout session is created for that amount, with your
 *      own payment gateway.
 *   3. Books the hold once payment has succeeded, passing your own order id as
 *      `bookingRef`. That reference is what makes the call idempotent: repeating
 *      the same request with the same reference cannot create a second sale, and
 *      a timeout is reconciled by repeating it rather than by generating a new
 *      one.
 *
 * The block below runs only when SEATLAYER_SECRET_KEY is set, so the repository
 * stays runnable without one. The key is read from the environment inside this
 * route handler, is never sent to the browser, and is never written to a log or
 * a response.
 *
 * Node server SDK: https://docs.seatlayer.io/server-sdk/node/
 * Idempotency and conflicts: https://docs.seatlayer.io/server-api/idempotency-and-conflicts/
 * Book inventory: https://docs.seatlayer.io/server-api/booking/
 */
interface HoldRequestBody {
  holdId?: string;
  /** Your own order reference. Present only when payment has already succeeded. */
  orderId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as HoldRequestBody | null;
  const holdId = body?.holdId;

  if (!holdId) {
    return NextResponse.json({ error: "holdId is required" }, { status: 400 });
  }

  const secretKey = process.env.SEATLAYER_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({
      ok: true,
      holdId,
      inspected: false,
      next: "Set SEATLAYER_SECRET_KEY to inspect this hold and book it on the server.",
    });
  }

  const { SeatLayer, SeatLayerConflictError, SeatLayerNotFoundError } = await import(
    "@seatlayer/server"
  );
  const seatlayer = new SeatLayer(secretKey);

  try {
    // Step 1. Authoritative seats and prices. Charge from this, never from the browser.
    const hold = await seatlayer.inventory.retrieveHold(eventKey, holdId);

    if (hold.status !== "active") {
      return NextResponse.json(
        { error: "hold_not_active", status: hold.status },
        { status: 409 },
      );
    }

    const labels = hold.items.map((item) => item.label);

    // Step 2. Your own checkout session belongs here, priced from hold.items and
    // charged through your own payment gateway. Nothing below runs until it has
    // succeeded and your order has a stable id.
    if (!body?.orderId) {
      return NextResponse.json({
        ok: true,
        holdId,
        inspected: true,
        expiresAt: hold.expiresAt,
        items: hold.items.map((item) => ({
          label: item.label,
          categoryKey: item.categoryKey,
          tierId: item.tierId,
          unitPrice: item.unitPrice,
          currency: item.currency,
          quantity: item.quantity ?? 1,
        })),
        next: "Charge for these items, then post the same hold id with your own orderId.",
      });
    }

    // Step 3. One order, one reference, for the exact seats that were priced.
    // Pinning the labels makes a changed hold fail instead of booking seats the
    // buyer was never charged for.
    const booking = await seatlayer.inventory.book(eventKey, {
      holdId,
      labels,
      bookingRef: body.orderId,
    });

    return NextResponse.json({ ok: true, booked: booking.booked, bookingRef: booking.bookingRef });
  } catch (cause) {
    if (cause instanceof SeatLayerNotFoundError) {
      return NextResponse.json({ error: "hold_not_found" }, { status: 404 });
    }
    if (cause instanceof SeatLayerConflictError) {
      // Do not retry a real conflict in a loop, and do not invent a new
      // reference. Void or refund as your own order state requires.
      return NextResponse.json({ error: "conflict" }, { status: 409 });
    }
    return NextResponse.json({ error: "hold_unavailable" }, { status: 502 });
  }
}
