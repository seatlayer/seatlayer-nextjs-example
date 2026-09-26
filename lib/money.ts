import { currency as eventCurrency } from "@/lib/config";

/**
 * Seat prices arrive in major currency units, so 45 means 45.00 in the
 * event's currency.
 */
export function formatMoney(amount: number, currency: string = eventCurrency): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatClock(msRemaining: number): string {
  const total = Math.max(0, Math.round(msRemaining / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
