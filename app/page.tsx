import Link from "next/link";
import { Icon } from "@/components/Icon";
import { sdkDemos } from "@/lib/demos";
import { demosUrl, hostedDemosUrl, repoUrl } from "@/lib/site";

export default function Page() {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={demosUrl}>Demos</a>
            <Icon name="chev" />
            <span aria-current="page">SDK</span>
          </nav>
          <div className="ph-grid">
            <h1>Build it into your app</h1>
            <p className="lede">
              The seat map inside your own React app. Buyers pick seats, SeatLayer holds them, and your own
              checkout takes the payment. Pick a demo, try it, then copy the code.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap overview">
        <div className="list-head">
          <h2>SDK demos</h2>
          <span>
            <b>{sdkDemos.length}</b> demos, all in <a href={repoUrl}>one open source Next.js app</a>.
          </span>
        </div>
        <ul className="dcards">
          {sdkDemos.map((demo) => (
            <li key={demo.slug}>
              <Link className="dcard" href={demo.href}>
                <span className="dc-ic">
                  <Icon name={demo.icon} />
                </span>
                <b>{demo.name}</b>
                <span className="dc-d">{demo.summary}</span>
                <span className="dc-go">
                  Try it <Icon name="arrow" />
                </span>
              </Link>
            </li>
          ))}
          <li>
            <a className="dcard dcard-alt" href={hostedDemosUrl}>
              <span className="dc-ic">
                <Icon name="ext" />
              </span>
              <b>Selling without code?</b>
              <span className="dc-d">Paste one tag and SeatLayer runs the booking page, payment and tickets.</span>
              <span className="dc-go">
                Hosted demos <Icon name="arrow" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
