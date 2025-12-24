# Contributing to XHubReel

Thank you for your interest in contributing to XHubReel! 🎉

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Git

### Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/xhub-reel.git
cd xhub-reel
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Build packages**

```bash
pnpm build
```

4. **Start development**

```bash
pnpm dev
```

## Project Structure

```
xhub-reel/
├── apps/
│   ├── web/          # Next.js demo app
│   └── docs/         # Documentation site
├── packages/
│   ├── core/         # Types, stores, utilities
│   ├── player/       # Video player
│   ├── ui/           # UI components
│   ├── gestures/     # Gesture system
│   ├── feed/         # Video feed
│   └── embed/        # Embeddable widget
├── e2e/              # Playwright tests
└── .storybook/       # Storybook config
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in dev mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm lint` | Lint all packages |
| `pnpm storybook` | Start Storybook |
| `pnpm changeset` | Create a changeset |

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feat/my-feature
# or
git checkout -b fix/my-bug-fix
```

### 2. Make Your Changes

Follow the coding conventions:

- TypeScript strict mode
- ESLint rules
- Prettier formatting
- Component naming: PascalCase
- Hook naming: camelCase with `use` prefix

### 3. Write Tests

- Unit tests in `__tests__/` directories
- E2E tests in `e2e/` directory
- Stories in `stories/` directories

### 4. Create a Changeset

```bash
pnpm changeset
```

Select the packages you changed and describe your changes.

### 5. Commit Your Changes

Follow conventional commits:

```bash
git commit -m "feat(player): add picture-in-picture support"
git commit -m "fix(feed): prevent memory leak on scroll"
git commit -m "docs(core): update API documentation"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### 6. Push and Create PR

```bash
git push origin feat/my-feature
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

```typescript
// ✅ Good
export function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  return `${(count / 1000).toFixed(1)}K`
}

// ❌ Bad - no types, uses any
export function formatCount(count) {
  return count < 1000 ? count : count / 1000 + 'K'
}
```

### React Components

```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ❌ Bad - no types, inline styles
export function Button(props) {
  return <button style={{color: 'red'}} onClick={props.onClick}>{props.children}</button>
}
```

### File Organization

```
components/
├── Button/
│   ├── Button.tsx        # Component
│   ├── Button.test.tsx   # Tests
│   ├── Button.stories.tsx # Stories
│   └── index.ts          # Export
```

## Performance Guidelines

- Bundle size budget: < 150KB total gzipped
- LCP target: < 1.5s
- No memory leaks after 50+ video scrolls
- 60fps scroll performance

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# UI mode
pnpm test:e2e:ui
```

### Storybook

```bash
pnpm storybook
```

## Documentation

- Update README.md when adding features
- Add JSDoc comments to exported functions
- Create/update Storybook stories for UI changes

## Release Process

1. Changesets are collected in `.changeset/`
2. When merged to main, GitHub Action creates Release PR
3. Merging Release PR publishes to npm

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

