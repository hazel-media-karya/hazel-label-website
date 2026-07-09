import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationRetryCount: 0,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },
};

export default nextConfig;
