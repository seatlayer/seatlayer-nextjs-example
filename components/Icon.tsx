const paths = {
  seats: (
    <>
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="18" cy="8" r="1.6" />
      <circle cx="6" cy="14" r="1.6" />
      <circle cx="12" cy="13" r="1.6" />
      <circle cx="18" cy="14" r="1.6" />
      <path d="M8 19h8" />
    </>
  ),
  best: <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.3 7.2 18.9l.9-5.4-3.9-3.8 5.4-.8z" />,
  season: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </>
  ),
  multi: (
    <>
      <rect x="7" y="3" width="13" height="13" rx="2" />
      <path d="M4 8v11a2 2 0 0 0 2 2h11" />
    </>
  ),
  handoff: (
    <>
      <path d="M4 8h13M13 4l4 4-4 4" />
      <path d="M20 16H7M11 12l-4 4 4 4" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chev: <path d="M9 6l6 6-6 6" />,
  ext: <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
};

export type IconName = keyof typeof paths;

/** Stroke icons, drawn inline so the app needs no icon font. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className ? `ico ${className}` : "ico"} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** The SeatLayer mark on its midnight tile. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 80 80" aria-hidden="true">
      <rect width="80" height="80" rx="18" fill="#0C1220" />
      <g transform="translate(8 12)">
        <path d="M4 13 Q16 6 29 7 L28.5 17 Q17 16.5 7 22 Z" fill="#F4B740" />
        <path d="M4 13 Q16 6 29 7 L28.5 17 Q17 16.5 7 22 Z" fill="#F4B740" transform="translate(64 0) scale(-1 1)" />
        <path d="M8 28 Q18 22 28.6 23 L28.2 32 Q18 28.5 10 36 Z" fill="#FCF7EE" />
        <path d="M8 28 Q18 22 28.6 23 L28.2 32 Q18 28.5 10 36 Z" fill="#FCF7EE" transform="translate(64 0) scale(-1 1)" />
        <path d="M11 41 Q19 35 28.2 36 L27.8 45 Q19.5 42 13.5 49 Z" fill="#FCF7EE" />
        <path d="M11 41 Q19 35 28.2 36 L27.8 45 Q19.5 42 13.5 49 Z" fill="#FCF7EE" transform="translate(64 0) scale(-1 1)" />
      </g>
    </svg>
  );
}
