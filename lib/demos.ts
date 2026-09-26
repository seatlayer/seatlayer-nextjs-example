import type { IconName } from "@/components/Icon";

export interface SdkDemo {
  slug: string;
  /** The App Router route. <Link> adds the base path. */
  href: string;
  name: string;
  hint: string;
  summary: string;
  icon: IconName;
}

/** The five SDK demos, in the order the switcher and the next-demo link use. */
export const sdkDemos: SdkDemo[] = [
  {
    slug: "seat-picker",
    href: "/seat-picker",
    name: "Seat picker",
    hint: "The full picker in React",
    summary: "The full picker in a React app, handing off to your checkout.",
    icon: "seats",
  },
  {
    slug: "best-available",
    href: "/best-available",
    name: "Best available",
    hint: "Best seats for a party",
    summary: "Ask for a party size and get the best seats together.",
    icon: "best",
  },
  {
    slug: "season-tickets",
    href: "/season-tickets",
    name: "Season tickets",
    hint: "Same seat all season",
    summary: "Sell the same seat across a whole season.",
    icon: "season",
  },
  {
    slug: "multiple-events",
    href: "/multiple-events",
    name: "Multiple events",
    hint: "Several events, one map",
    summary: "Several events on one page with one seat map component.",
    icon: "multi",
  },
  {
    slug: "checkout-handoff",
    href: "/checkout-handoff",
    name: "Checkout handoff",
    hint: "What your server gets",
    summary: "Your own cart, then your server reads the hold and books it.",
    icon: "handoff",
  },
];

export function demoBySlug(slug: string): SdkDemo {
  const demo = sdkDemos.find((entry) => entry.slug === slug);
  if (!demo) throw new Error(`Unknown demo ${slug}`);
  return demo;
}

export function nextDemo(slug: string): SdkDemo | null {
  const index = sdkDemos.findIndex((entry) => entry.slug === slug);
  return index >= 0 && index < sdkDemos.length - 1 ? sdkDemos[index + 1] : null;
}
