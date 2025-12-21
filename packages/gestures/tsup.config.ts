import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  external: [
    'react',
    'react-dom',
    '@vortex/core',
    // Motion library - all variants
    'motion',
    'motion/react',
    'framer-motion',
    // Icons
    'lucide-react',
    // Gesture library
    '@use-gesture/react',
  ],
  treeshake: true,
  splitting: false,
})

