/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // The buyer runtime loads its locale bundles with a dynamic import, which
    // webpack reports as a critical dependency. The import is deliberate and
    // resolves at runtime, so the warning is quietened here.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      { module: /@seatlayer[\\/]js/, message: /Critical dependency/ },
    ];
    return config;
  },
};

export default nextConfig;
