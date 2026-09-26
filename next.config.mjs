/**
 * SEATLAYER_BASE_PATH is optional. Leave it unset and the app runs at `/`.
 * Set it (for example `/demos`) to serve every page and asset under that path.
 */
const basePath = process.env.SEATLAYER_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  env: {
    // The browser needs the same prefix for fetch() calls and plain links.
    NEXT_PUBLIC_SEATLAYER_BASE_PATH: basePath,
  },
  webpack(config) {
    // The buyer runtime loads its locale bundles with a dynamic import, which
    // webpack reports as a critical dependency. The import is deliberate and
    // resolves at runtime, so the warning is quietened here.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      { module: /@seatlayer[\\/]js/, message: /Critical dependency/ },
    ];
    // Lets app/html/route.ts import app/html/index.html as a string, so the
    // template stays a plain HTML file you can copy as it is.
    config.module.rules.push({ test: /\.html$/, type: "asset/source" });
    return config;
  },
};

export default nextConfig;
