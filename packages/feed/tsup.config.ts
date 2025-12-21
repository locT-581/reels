import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@vortex/core',
    '@vortex/player',
    '@tanstack/react-virtual',
    'motion',
    'motion/react',
    'lucide-react',
  ],
  treeshake: true,
  splitting: false,
})

