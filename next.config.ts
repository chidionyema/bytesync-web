import type { NextConfig } from "next";

// Static export: every route is HTML at build time. Placed on the Cloudflare
// Pages free rung of the estate's placement ladder (idp ADR 0034), so nothing
// runs on the cluster for a site that changes by pull request.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
