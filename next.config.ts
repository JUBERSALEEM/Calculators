import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*.e2b.app"],
  experimental: {
    // App Router is stable; no flags required.
  },
  typescript: {
    // Type checking is run explicitly via `tsc --noEmit` in CI (G1).
    ignoreBuildErrors: false,
  },
  eslint: {
    // Linting is run explicitly via `next lint` in CI (G2).
    ignoreDuringBuilds: false,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/robots.txt",
        headers: [{ key: "X-Robots-Tag", value: "public" }],
      },
    ];
  },
};

export default nextConfig;
