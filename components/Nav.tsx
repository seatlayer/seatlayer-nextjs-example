import Link from "next/link";

const routes = [
  { href: "/", label: "Single event" },
  { href: "/seat-picker", label: "Seat picker" },
  { href: "/season", label: "Season tickets" },
  { href: "/events", label: "Multiple events" },
  { href: "/best-available", label: "Best available" },
  { href: "/checkout-handoff", label: "Checkout handoff" },
  { href: "/control-room", label: "Control room" },
];

export function Nav() {
  return (
    <nav className="nav" aria-label="Examples">
      {routes.map((route) => (
        <Link key={route.href} href={route.href} className="nav-link">
          {route.label}
        </Link>
      ))}
      {/* A route handler rather than a page, so a plain link loads it. */}
      <a href="/html" className="nav-link">
        Plain HTML
      </a>
    </nav>
  );
}
