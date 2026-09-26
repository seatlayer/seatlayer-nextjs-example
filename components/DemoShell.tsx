import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CodePanel, type CodeTab } from "@/components/CodePanel";
import { demoBySlug, nextDemo, sdkDemos } from "@/lib/demos";
import { demosUrl, docsUrl, hostedDemosUrl, repoFile, signUpUrl } from "@/lib/site";

interface DemoShellProps {
  slug: string;
  lede: string;
  steps: [string, string][];
  code: CodeTab[];
  /** The repository file the sample comes from. */
  sourceFile: string;
  sideHeading: string;
  sideText: string;
  swapNote: React.ReactNode;
  docsHref: string;
  children: React.ReactNode;
}

/**
 * The frame every SDK demo shares: where you are, every other demo, how to try
 * it, the demo itself at full width, the code, and the next demo.
 */
export function DemoShell(props: DemoShellProps) {
  const demo = demoBySlug(props.slug);
  const next = nextDemo(props.slug);

  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={demosUrl}>Demos</a>
            <Icon name="chev" />
            <Link href="/">SDK</Link>
            <Icon name="chev" />
            <span aria-current="page">{demo.name}</span>
          </nav>
          <div className="ph-grid">
            <h1>{demo.name}</h1>
            <p className="lede">{props.lede}</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <nav className="switcher" aria-label="SDK demos">
          <div className="sw-head">
            <h2>SDK demos</h2>
            <span className="sw-count">
              <b>{sdkDemos.length}</b> demos<span className="sw-swipe"> · swipe for more</span>
            </span>
            <Link className="sw-all" href="/">
              See all <Icon name="arrow" />
            </Link>
          </div>
          <div className="sw-scroll">
            <ul className="sw-row" style={{ "--n": sdkDemos.length } as React.CSSProperties}>
              {sdkDemos.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    className="sw-tile"
                    href={entry.href}
                    aria-current={entry.slug === demo.slug ? "page" : undefined}
                  >
                    <span className="sw-ic">
                      <Icon name={entry.icon} />
                    </span>
                    <span className="sw-txt">
                      <b>{entry.name}</b>
                      <small>{entry.slug === demo.slug ? "You are here" : entry.hint}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="wrap stack">
        <section className="strip" aria-labelledby="try-h">
          <div className="strip-title">
            <h2 id="try-h">Try it</h2>
            <span className="lamp">Test mode</span>
          </div>
          <ol className="strip-steps">
            {props.steps.map(([title, detail]) => (
              <li key={title}>
                <span>
                  <b>{title}</b>
                  <small>
                    <span className="sr">: </span>
                    {detail}
                  </small>
                </span>
              </li>
            ))}
          </ol>
          <div className="strip-notes">
            <span>
              <Icon name="lock" />
              No real money moves.
            </span>
            <span>
              <Icon name="moon" />
              Seats reset every night.
            </span>
          </div>
        </section>

        {props.children}

        <CodePanel tabs={props.code}>
          <h3>{props.sideHeading}</h3>
          <p>{props.sideText}</p>
          <div className="swapnote">{props.swapNote}</div>
          <div className="cp-links">
            <a className="link" href={repoFile(props.sourceFile)}>
              View on GitHub <Icon name="ext" />
            </a>
            <a className="link" href={props.docsHref || docsUrl}>
              Read the docs <Icon name="ext" />
            </a>
          </div>
          <a className="btn btn-amber" href={signUpUrl}>
            Start free <Icon name="arrow" />
          </a>
        </CodePanel>
      </div>

      <nav className="nextband" aria-label="More demos">
        <div className="wrap nextband-in">
          <Link className="backlink" href="/">
            <Icon name="back" />
            All SDK demos
          </Link>
          {next ? (
            <Link className="nextcard" href={next.href}>
              <span>
                <small>Next demo</small>
                <b>{next.name}</b>
                <span>{next.summary}</span>
              </span>
              <span className="go">
                <Icon name="arrow" />
              </span>
            </Link>
          ) : (
            <a className="nextcard" href={hostedDemosUrl}>
              <span>
                <small>Selling without code?</small>
                <b>Hosted demos</b>
                <span>Paste one tag and SeatLayer runs the booking page.</span>
              </span>
              <span className="go">
                <Icon name="arrow" />
              </span>
            </a>
          )}
        </div>
      </nav>
    </>
  );
}
