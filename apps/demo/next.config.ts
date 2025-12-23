import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@vortex/core',
    '@vortex/player',
    '@vortex/player-core',
    '@vortex/feed',
    '@vortex/gestures',
    '@vortex/ui',
    '@vortex/embed',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig

