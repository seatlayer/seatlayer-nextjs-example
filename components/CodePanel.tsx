"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { highlight } from "@/lib/highlight";

export interface CodeTab {
  id: string;
  label: string;
  file: string;
  code: string;
}

interface CodePanelProps {
  tabs: CodeTab[];
  children: React.ReactNode;
}

/** "Copy this code": the sample on the left, the notes and links on the right. */
export function CodePanel({ tabs, children }: CodePanelProps) {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const tab = tabs.find((entry) => entry.id === active) ?? tabs[0];

  function copy() {
    void navigator.clipboard?.writeText(tab.code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <section className="codepanel" aria-labelledby="code-h">
      <div className="cp-main">
        <div className="cp-top">
          <h2 id="code-h">Copy this code</h2>
          {tabs.length > 1 ? (
            <div className="tabs" role="tablist" aria-label="Code part">
              {tabs.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={entry.id === tab.id}
                  onClick={() => setActive(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="codewrap">
          <div className="code-top">
            <span className="code-file">{tab.file}</span>
            <button type="button" className="copy copy-dark" onClick={copy}>
              <Icon name="copy" />
              <span>{copied ? "Copied" : "Copy code"}</span>
            </button>
          </div>
          <pre className="code" dangerouslySetInnerHTML={{ __html: highlight(tab.code) }} />
        </div>
      </div>
      <aside className="cp-side">{children}</aside>
    </section>
  );
}
