import template from "./index.html";
import { eventKey, publicKey } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * The same seat picker as a plain HTML page, with no React and no build step.
 *
 * app/html/index.html is the page exactly as you would copy it into your own
 * site. This route only swaps its two placeholders for the keys in the
 * environment when a request arrives.
 *
 * Script tag install: https://docs.seatlayer.io/buyer-sdk/install/
 */
export function GET() {
  if (!isKey(eventKey) || !isKey(publicKey)) {
    return html(
      "<!doctype html><title>Add your event keys</title>" +
        "<p>Set NEXT_PUBLIC_SEATLAYER_EVENT_KEY and NEXT_PUBLIC_SEATLAYER_PUBLIC_KEY, " +
        "then restart the server.</p>",
    );
  }

  return html(
    template
      .replace(/<YOUR_EVENT_KEY>/g, eventKey)
      .replace(/<YOUR_PUBLIC_KEY>/g, publicKey),
  );
}

/** Keys are plain ids, so anything else is refused rather than written into a script. */
function isKey(value: string) {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

function html(body: string) {
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
