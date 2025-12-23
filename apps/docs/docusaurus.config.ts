import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'VortexStream',
  tagline: 'High-performance short-form video SDK for React',
  favicon: 'img/favicon.ico',

  url: 'https://vortexstream.dev',
  baseUrl: '/',

  organizationName: 'vortexstream',
  projectName: 'vortexstream',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/vortexstream/vortexstream/tree/main/apps/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/vortexstream/vortexstream/tree/main/apps/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/vortex-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'VortexStream',
      logo: {
        alt: 'VortexStream Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/category/api-reference',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/vortexstream/vortexstream',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/category/api-reference',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: '@vortex/core',
              to: '/docs/packages/core',
            },
            {
              label: '@vortex/player',
              to: '/docs/packages/player',
            },
            {
              label: '@vortex/feed',
              to: '/docs/packages/feed',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vortexstream/vortexstream',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/org/vortex',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} VortexStream. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'tsx', 'json'],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'vortexstream',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
}

export default config

