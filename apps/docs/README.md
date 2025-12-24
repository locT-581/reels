# XHubReel Documentation

Documentation site cho XHubReel - High-performance short-form video SDK.

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem documentation.

### Build

```bash
pnpm build
```

### Serve production build

```bash
pnpm serve
```

## Structure

```
docs/
├── docs/
│   ├── intro.md              # Introduction
│   ├── getting-started/      # Getting started guides
│   ├── guides/               # Integration guides
│   ├── packages/             # Package documentation
│   ├── api/                  # API reference
│   └── examples/             # Code examples
├── src/
│   ├── css/                  # Custom styles
│   ├── pages/                # Custom pages
│   └── components/           # React components
├── static/                   # Static assets
├── docusaurus.config.ts      # Docusaurus config
├── sidebars.ts               # Sidebar config
└── package.json
```

## Adding New Documentation

1. Create new `.md` file in appropriate folder
2. Add frontmatter with `sidebar_position`
3. Update `sidebars.ts` if needed

```md
---
sidebar_position: 1
---

# Page Title

Content here...
```

## Built With

- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

