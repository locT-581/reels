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
    'motion',
    'motion/react',
    'lucide-react',
  ],
  treeshake: true,
  splitting: false,
})

