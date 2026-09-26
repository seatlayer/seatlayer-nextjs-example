import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext settings for Cloudflare Workers.
 *
 * The example has no revalidation, so prerendered pages are served straight
 * from Workers static assets and no cache bucket is needed.
 * https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
