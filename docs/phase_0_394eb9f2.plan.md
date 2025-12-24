---
name: "Phase 0 "
overview: Thiết lập monorepo XHubReel với Turborepo + pnpm, cấu trúc thư mục phù hợp với Cursor Rules globs, và cài đặt tất cả dependencies cần thiết.
todos: []
---

# Phase 0: XHubReel Project Setup

## Monorepo Structure

Cấu trúc thư mục được thiết kế để match với Cursor Rules globs:

```
xhub-reel/
├── apps/
│   ├── web/                          # Next.js 15 app
│   │   ├── app/                      # App Router
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── docs/                         # Nextra docs (optional, later)
├── packages/
│   ├── core/                         # @xhub-reel/core
│   │   └── src/
│   │       ├── types/                # TypeScript types
│   │       ├── stores/               # Zustand stores (matches **/stores/**)
│   │       ├── hooks/                # Custom hooks
│   │       ├── utils/                # Utility functions
│   │       ├── constants/            # Constants
│   │       └── index.ts
│   ├── player/                       # @xhub-reel/player (matches **/player/**)
│   │   └── src/
│   │       ├── core/                 # HLS engine
│   │       ├── components/           # Player components (matches **/components/**)
│   │       ├── hooks/
│   │       └── index.ts
│   ├── ui/                           # @xhub-reel/ui (matches **/ui/**)
│   │   └── src/
│   │       ├── components/           # UI components (matches **/components/**)
│   │       └── index.ts
│   ├── gestures/                     # @xhub-reel/gestures (matches **/gestures/**)
│   │   └── src/
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── index.ts
│   ├── feed/                         # @xhub-reel/feed (matches **/feed/**)
│   │   └── src/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── index.ts
│   └── embed/                        # @xhub-reel/embed
│       └── src/
│           └── index.ts
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
└── .editorconfig
```

## Implementation Steps

### Step 1: Initialize Monorepo Root

Create root `package.json` with Turborepo:

```json
{
  "name": "xhub-reel",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  }
}
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Create `turbo.json` with pipeline config.

### Step 2: TypeScript Configuration

Create `tsconfig.base.json` at root with strict mode and path aliases for `@xhub-reel/*` packages.

### Step 3: ESLint and Prettier

- `.eslintrc.js` - ESLint config with Next.js, TypeScript rules
- `.prettierrc` - Prettier config (singleQuote, semi, etc.)
- `.editorconfig` - Editor settings

### Step 4: Initialize Next.js App (apps/web)

Create Next.js 15 app with:
- App Router structure
- Turbopack enabled
- Tailwind CSS 4 configured with XHubReel design system colors
- Basic layout with `bg-black` background

Key files:
- `apps/web/app/layout.tsx` - Root layout with Inter font
- `apps/web/app/page.tsx` - Placeholder home page
- `apps/web/tailwind.config.ts` - XHubReel color palette, 8pt spacing

### Step 5: Initialize Packages

Each package needs:
- `package.json` with name `@xhub-reel/{name}`
- `tsconfig.json` extending base
- `tsup.config.ts` for bundling
- `src/index.ts` barrel export

Packages to create:
1. `packages/core` - Core types, stores, hooks, utils
2. `packages/player` - Video player (structure for HLS engine)
3. `packages/ui` - UI components
4. `packages/gestures` - Gesture hooks
5. `packages/feed` - Feed virtualization
6. `packages/embed` - Embeddable widget

### Step 6: Install Dependencies

Core dependencies:
- `react@19`, `react-dom@19`
- `next@15`
- `typescript@5.7`
- `tailwindcss@4`
- `motion` (motion.dev)
- `zustand`
- `@tanstack/react-query`
- `@tanstack/react-virtual`
- `@use-gesture/react`
- `hls.js`
- `lucide-react`

Dev dependencies:
- `vitest`
- `@playwright/test`
- `@storybook/react`
- `tsup`
- `eslint`, `prettier`
- `husky`, `lint-staged`

## Key Configuration Details

### Tailwind Config (XHubReel Design System)

```typescript
// apps/web/tailwind.config.ts
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/*/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'xhub-reel-black': '#000000',
        'xhub-reel-violet': '#8B5CF6',
        'xhub-reel-red': '#FF2D55',
        'xhub-reel-gray': '#8E8E93',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      transitionTimingFunction: {
        'xhub-reel': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
}
```

### Package tsup Config

```typescript
// packages/*/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
})
```

## Files to Create

| File | Purpose |
|------|---------|
| `package.json` | Root monorepo config |
| `pnpm-workspace.yaml` | Workspace definition |
| `turbo.json` | Turborepo pipeline |
| `tsconfig.base.json` | Shared TypeScript config |
| `.eslintrc.js` | ESLint rules |
| `.prettierrc` | Prettier config |
| `.editorconfig` | Editor settings |
| `.gitignore` | Git ignore patterns |
| `apps/web/*` | Next.js app structure |
| `packages/core/*` | Core package skeleton |
| `packages/player/*` | Player package skeleton |
| `packages/ui/*` | UI package skeleton |
| `packages/gestures/*` | Gestures package skeleton |
| `packages/feed/*` | Feed package skeleton |
| `packages/embed/*` | Embed package skeleton |

## Verification

After setup, verify:
1. `pnpm install` succeeds
2. `pnpm dev` starts Next.js app on localhost:3000
3. `pnpm build` builds all packages
4. Tailwind classes work with XHubReel colors
5. Package imports work: `import { } from '@xhub-reel/core'`