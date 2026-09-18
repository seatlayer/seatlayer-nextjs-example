/**
 * Both values come from .env.local. Copy .env.example to .env.local and fill
 * them in with your own event key and publishable key.
 */
export const eventKey = process.env.NEXT_PUBLIC_SEATLAYER_EVENT_KEY ?? "";
export const publicKey = process.env.NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY ?? "";

/** Prices in this example are shown in USD. */
export const currency = "USD";

export const isConfigured = eventKey.length > 0 && publicKey.length > 0;
