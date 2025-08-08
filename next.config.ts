import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable auto vendor-chunk optimization that can reference missing chunks
    // (notably for framer-motion). We can selectively re-enable later.
    optimizePackageImports: []
  },
};

export default nextConfig;
