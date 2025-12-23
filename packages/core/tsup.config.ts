import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'stores/index': 'src/stores/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'utils/index': 'src/utils/index.ts',
    'constants/index': 'src/constants/index.ts',
    'api/index': 'src/api/index.ts',
    'storage/index': 'src/storage/index.ts',
    'offline/index': 'src/offline/index.ts',
    'styles/index': 'src/styles/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
})

