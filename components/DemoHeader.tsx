import Link from "next/link";
import { Icon, Mark } from "@/components/Icon";
import { chartsUrl, demosUrl, docsUrl, hostedDemosUrl, repoUrl, signUpUrl } from "@/lib/site";

/**
 * The demos header: Hosted and Charts & 3D live on seatlayer.io, SDK is this
 * app. ?embed=1 hides it (see app/layout.tsx).
 */
export function DemoHeader() {
  return (
    <header className="dh">
      <div className="dh-in">
        <a className="dh-logo" href={demosUrl}>
          <Mark />
          SeatLayer<span className="dh-sub">Demos</span>
        </a>
        <nav className="dh-links" aria-label="Demo sections">
          <a href={hostedDemosUrl}>Hosted</a>
          <Link href="/" aria-current="page">
            SDK
          </Link>
          <a href={chartsUrl}>
            Charts &amp; 3D <Icon name="ext" className="ico-ext" />
          </a>
        </nav>
        <div className="dh-right">
          <a className="dh-text" href={docsUrl}>
            Docs
          </a>
          <a className="dh-text" href={repoUrl}>
            GitHub
          </a>
          <a className="btn btn-amber btn-sm" href={signUpUrl}>
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}
