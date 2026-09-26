/**
 * Loads a SeatLayer embed script once per page. When the script is already on
 * the page (a second embed, or a client-side route change), it asks the
 * runtime to scan again so the new element is rendered too.
 */
export function loadSeatLayerScript(src: string, runtime: "SeatLayerEvents" | "SeatLayerCollections") {
  if (typeof window === "undefined") return;
  const loaded = (window as unknown as Record<string, { scan?: () => void } | undefined>)[runtime];
  if (loaded?.scan) {
    loaded.scan();
    return;
  }
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}
