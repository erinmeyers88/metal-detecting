import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
