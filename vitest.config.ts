import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
        'vitest.*.ts',
      ],
    },
    alias: {
      '@xhub-reel/core': path.resolve(__dirname, './packages/core/src'),
      '@xhub-reel/player': path.resolve(__dirname, './packages/player/src'),
      '@xhub-reel/ui': path.resolve(__dirname, './packages/ui/src'),
      '@xhub-reel/gestures': path.resolve(__dirname, './packages/gestures/src'),
      '@xhub-reel/feed': path.resolve(__dirname, './packages/feed/src'),
      '@xhub-reel/embed': path.resolve(__dirname, './packages/embed/src'),
    },
  },
  resolve: {
    alias: {
      '@xhub-reel/core': path.resolve(__dirname, './packages/core/src'),
      '@xhub-reel/player': path.resolve(__dirname, './packages/player/src'),
      '@xhub-reel/ui': path.resolve(__dirname, './packages/ui/src'),
      '@xhub-reel/gestures': path.resolve(__dirname, './packages/gestures/src'),
      '@xhub-reel/feed': path.resolve(__dirname, './packages/feed/src'),
      '@xhub-reel/embed': path.resolve(__dirname, './packages/embed/src'),
    },
  },
})

