import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.ccb.farm',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
