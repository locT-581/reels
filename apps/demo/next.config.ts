import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/player-core',
    '@xhub-reel/feed',
    '@xhub-reel/gestures',
    '@xhub-reel/ui',
    '@xhub-reel/embed',
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

