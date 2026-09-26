interface BookingCardProps {
  /** The booking link from your dashboard (a season or a run of shows). */
  href: string;
  title: string;
  /** For example "3 performances: 6 Nov, 20 Nov and 4 Dec 2026". */
  dates?: string;
  /** For example "€120". */
  fromPrice?: string;
  /** For example "Book season tickets" or "Choose a performance". */
  buttonLabel: string;
  className?: string;
}

/**
 * A plain link card for season tickets or a run of shows. No script runs: the
 * button opens the SeatLayer booking page, which handles seats, payment and
 * tickets. Style it with your own CSS.
 * Try it live: https://seatlayer.io/demo/hosted/season-ticket/
 */
export function BookingCard({ href, title, dates, fromPrice, buttonLabel, className = "seatlayer-season-card" }: BookingCardProps) {
  return (
    <div className={className}>
      <h3>{title}</h3>
      {dates ? <p>{dates}</p> : null}
      {fromPrice ? <p>From {fromPrice}</p> : null}
      <a href={href} target="_blank" rel="noopener">
        {buttonLabel}
      </a>
    </div>
  );
}
