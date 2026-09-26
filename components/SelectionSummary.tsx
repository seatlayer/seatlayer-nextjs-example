import type { SelectedSeat } from "@seatlayer/react";
import { formatMoney } from "@/lib/money";

interface SelectionSummaryProps {
  seats: SelectedSeat[];
  total: number;
}

export function SelectionSummary({ seats, total }: SelectionSummaryProps) {
  if (seats.length === 0) {
    return <p className="muted">Pick a seat on the map to start.</p>;
  }

  return (
    <div className="summary">
      <ul className="seat-list">
        {seats.map((seat) => (
          <li key={seat.id}>
            <span>{describe(seat)}</span>
            <span className="price">{formatMoney(seat.price ?? 0)}</span>
          </li>
        ))}
      </ul>
      <p className="total">
        <span>
          Total for {seats.length} {seats.length === 1 ? "seat" : "seats"}
        </span>
        <span className="price">{formatMoney(total)}</span>
      </p>
    </div>
  );
}

function describe(seat: SelectedSeat): string {
  const parts = [seat.sectionLabel, seat.rowLabel && `Row ${seat.rowLabel}`, seat.seatNumber && `Seat ${seat.seatNumber}`];
  const address = parts.filter(Boolean).join(" · ");
  return address.length > 0 ? address : seat.displayLabel ?? seat.label;
}
