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
    '@tanstack/react-virtual',
    '@tanstack/react-query',
    '@use-gesture/react',
    'zustand',
    'zustand/middleware',
    'clsx',
    'tailwind-merge',
  ],
  // Bundle only vortex packages
  noExternal: [
    '@vortex/core',
    '@vortex/player',
    '@vortex/ui',
    '@vortex/gestures',
    '@vortex/feed',
  ],
})
