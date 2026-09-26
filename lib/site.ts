/**
 * Links and paths shared by every page.
 *
 * The app runs at the root of its domain by default. Set SEATLAYER_BASE_PATH
 * (for example /demos) at build time to serve it under a sub-path instead;
 * next.config.mjs passes the same value to the browser as
 * NEXT_PUBLIC_SEATLAYER_BASE_PATH. Next.js prefixes <Link> hrefs on its own,
 * but fetch() calls and plain <a> tags need withBase().
 */
export const basePath = process.env.NEXT_PUBLIC_SEATLAYER_BASE_PATH ?? "";

export function withBase(path: string): string {
  return `${basePath}${path}`;
}

export const repoUrl = "https://github.com/seatlayer/seatlayer-nextjs-example";
export const repoFile = (path: string) => `${repoUrl}/blob/main/${path}`;
export const demosUrl = "https://seatlayer.io/demo/";
export const hostedDemosUrl = "https://seatlayer.io/demo/#hosted";
export const chartsUrl = "https://app.seatlayer.io/demo/";
export const docsUrl = "https://docs.seatlayer.io";
export const signUpUrl = "https://app.seatlayer.io";
