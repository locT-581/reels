import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/player-engine',
    '@xhub-reel/ui',
    '@tanstack/react-query',
    'motion',
    'motion/react',
    'lucide-react',
  ],
  treeshake: true,
  splitting: false,
})

