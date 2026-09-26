export interface HandoffRow {
  field: string;
  value: React.ReactNode;
}

/** "What your checkout gets": the fields your own checkout receives. */
export function HandoffTable({
  title,
  note,
  rows,
  empty,
}: {
  title: string;
  note: string;
  rows: HandoffRow[] | null;
  empty: string;
}) {
  return (
    <section className="handoff" aria-labelledby="handoff-h" aria-live="polite">
      <div className="ho-head">
        <h2 id="handoff-h">{title}</h2>
        <span>{note}</span>
      </div>
      {rows ? (
        <dl>
          {rows.map((row) => (
            <div key={row.field}>
              <dt className="mono">{row.field}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="ho-empty">{empty}</p>
      )}
    </section>
  );
}
