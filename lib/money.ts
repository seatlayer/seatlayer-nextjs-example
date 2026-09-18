/**
 * Seat prices arrive in major currency units, so 45 means $45.00.
 */
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatUsd(amount: number): string {
  return formatter.format(amount);
}

export function formatClock(msRemaining: number): string {
  const total = Math.max(0, Math.round(msRemaining / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
