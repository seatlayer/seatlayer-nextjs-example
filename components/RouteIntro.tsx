interface RouteIntroProps {
  title: string;
  question: string;
  docsHref: string;
  docsLabel: string;
}

/** The heading, the question the route answers, and its documentation page. */
export function RouteIntro({ title, question, docsHref, docsLabel }: RouteIntroProps) {
  return (
    <header className="intro">
      <h1>{title}</h1>
      <p>{question}</p>
      <p className="muted small">
        Documentation: <a href={docsHref}>{docsLabel}</a>
      </p>
    </header>
  );
}
