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
    'motion',
    'motion/react',
    'lucide-react',
    'hls.js',
  ],
  treeshake: true,
  splitting: false,
})

