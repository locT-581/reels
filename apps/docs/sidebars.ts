import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/project-structure',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/basic-integration',
        'guides/nextjs-integration',
        'guides/custom-ui',
        'guides/gestures',
        'guides/offline-support',
        'guides/performance',
      ],
    },
    {
      type: 'category',
      label: 'Packages',
      items: [
        'packages/core',
        'packages/player',
        'packages/feed',
        'packages/gestures',
        'packages/ui',
        'packages/embed',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/types',
        'api/stores',
        'api/hooks',
        'api/components',
        'api/utilities',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/basic-feed',
        'examples/single-player',
        'examples/custom-actions',
        'examples/infinite-scroll',
      ],
    },
    'troubleshooting',
    'changelog',
  ],
}

export default sidebars

