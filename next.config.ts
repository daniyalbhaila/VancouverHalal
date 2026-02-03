import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable browser-native View Transitions API for smooth page transitions
    viewTransition: true,
  },
  images: {
    qualities: [60, 70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'http', // Google sometimes serves http for t3.gstatic
        hostname: '*.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/best-halal-restaurants-in-:city',
        destination: '/city/:city',
      },
    ];
  },
};

export default nextConfig;
