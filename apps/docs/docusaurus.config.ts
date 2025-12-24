import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'XHubReel',
  tagline: 'High-performance short-form video SDK for React',
  favicon: 'img/favicon.ico',

  url: 'https://xhubreel.dev',
  baseUrl: '/',

  organizationName: 'xhub-reel',
  projectName: 'xhub-reel',

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
          editUrl: 'https://github.com/xhub-reel/xhub-reel/tree/main/apps/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/xhub-reel/xhub-reel/tree/main/apps/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/xhub-reel-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'XHubReel',
      logo: {
        alt: 'XHubReel Logo',
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
          to: '/docs/api/types',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/xhub-reel/xhub-reel',
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
              to: '/docs/getting-started/installation',
            },
            {
              label: 'API Reference',
              to: '/docs/api/types',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: '@xhub-reel/core',
              to: '/docs/packages/core',
            },
            {
              label: '@xhub-reel/player',
              to: '/docs/packages/player',
            },
            {
              label: '@xhub-reel/feed',
              to: '/docs/packages/feed',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/xhub-reel/xhub-reel',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/org/xhub-reel',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} XHubReel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'tsx', 'json'],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'xhubreel',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
}

export default config

