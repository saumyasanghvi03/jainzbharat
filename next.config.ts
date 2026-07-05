import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  env: {
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/dashboard',
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: '/',
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: '/',
  },
  async redirects() {
    return [{ source: '/map', destination: '/navkar-heatmap', permanent: true }];
  },
};

export default nextConfig;
