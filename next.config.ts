import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  async redirects() {
    return [{ source: '/map', destination: '/navkar-heatmap', permanent: true }];
  },
};

export default nextConfig;
