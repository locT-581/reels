import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/search',
    component: ComponentCreator('/search', '5de'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '8ea'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '1e1'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'b87'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'eb4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/components',
                component: ComponentCreator('/docs/api/components', 'f46'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/hooks',
                component: ComponentCreator('/docs/api/hooks', 'ae7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/stores',
                component: ComponentCreator('/docs/api/stores', '08f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/types',
                component: ComponentCreator('/docs/api/types', '24b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/utilities',
                component: ComponentCreator('/docs/api/utilities', 'c14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', '249'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/basic-feed',
                component: ComponentCreator('/docs/examples/basic-feed', '168'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/custom-actions',
                component: ComponentCreator('/docs/examples/custom-actions', '02f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/infinite-scroll',
                component: ComponentCreator('/docs/examples/infinite-scroll', '907'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/single-player',
                component: ComponentCreator('/docs/examples/single-player', '78f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', '324'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/project-structure',
                component: ComponentCreator('/docs/getting-started/project-structure', 'a9f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '941'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/basic-integration',
                component: ComponentCreator('/docs/guides/basic-integration', '749'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/custom-ui',
                component: ComponentCreator('/docs/guides/custom-ui', '458'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/gestures',
                component: ComponentCreator('/docs/guides/gestures', 'd20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/nextjs-integration',
                component: ComponentCreator('/docs/guides/nextjs-integration', 'dfa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/offline-support',
                component: ComponentCreator('/docs/guides/offline-support', '37b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/performance',
                component: ComponentCreator('/docs/guides/performance', '0eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/core',
                component: ComponentCreator('/docs/packages/core', '466'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/embed',
                component: ComponentCreator('/docs/packages/embed', '259'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/feed',
                component: ComponentCreator('/docs/packages/feed', 'cb3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/gestures',
                component: ComponentCreator('/docs/packages/gestures', '18c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/player',
                component: ComponentCreator('/docs/packages/player', '991'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/ui',
                component: ComponentCreator('/docs/packages/ui', 'd66'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting',
                component: ComponentCreator('/docs/troubleshooting', '0a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
