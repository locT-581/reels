import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: true,
  // External large dependencies - users must install these
  external: [
    // React ecosystem
    'react',
    'react-dom',
    // Large dependencies that should be peer deps
    'hls.js',
    'motion',
    'motion/react',
    'framer-motion',
    'lucide-react',
    '@tanstack/react-query',
    '@use-gesture/react',
    'zustand',
    'zustand/middleware',
    'clsx',
    'tailwind-merge',
    // Design tokens needs to be external since it's referenced by @xhub-reel/core
    '@xhub-reel/design-tokens',
  ],
  // Bundle only xhub-reel packages (excluding design-tokens)
  noExternal: [
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/player-core',
    '@xhub-reel/player-engine',
    '@xhub-reel/ui',
    '@xhub-reel/gestures',
    '@xhub-reel/feed',
    '@xhub-reel/types',
  ],
})
