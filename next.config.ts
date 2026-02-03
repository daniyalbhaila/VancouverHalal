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
    deviceSizes: [320, 360, 390, 420, 450, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
