interface SetupNoticeProps {
  /** The environment variables this route needs before it can render. */
  variables: string[];
}

/**
 * Shown instead of a chart while the keys are missing, so the repository can be
 * cloned and started without an account.
 */
export function SetupNotice({ variables }: SetupNoticeProps) {
  return (
    <section className="setup" data-testid="setup-notice">
      <h2>Add your event keys</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code>, set{" "}
        {variables.map((name, index) => (
          <span key={name}>
            {index > 0 ? ", " : ""}
            <code>{name}</code>
          </span>
        ))}
        , then restart the dev server.
      </p>
    </section>
  );
}
