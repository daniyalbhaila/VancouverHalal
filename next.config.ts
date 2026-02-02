import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable browser-native View Transitions API for smooth page transitions
    viewTransition: true,
  },
};

export default nextConfig;
