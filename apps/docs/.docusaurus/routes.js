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
    component: ComponentCreator('/docs', 'd2b'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'a06'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '448'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '586'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/components',
                component: ComponentCreator('/docs/api/components', '0a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/hooks',
                component: ComponentCreator('/docs/api/hooks', '712'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/stores',
                component: ComponentCreator('/docs/api/stores', '41a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/types',
                component: ComponentCreator('/docs/api/types', 'c54'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/utilities',
                component: ComponentCreator('/docs/api/utilities', 'a1b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', '49b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/basic-feed',
                component: ComponentCreator('/docs/examples/basic-feed', '35d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/custom-actions',
                component: ComponentCreator('/docs/examples/custom-actions', '64a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/infinite-scroll',
                component: ComponentCreator('/docs/examples/infinite-scroll', 'c37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/examples/single-player',
                component: ComponentCreator('/docs/examples/single-player', '724'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', '36a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/project-structure',
                component: ComponentCreator('/docs/getting-started/project-structure', 'eea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '8cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/basic-integration',
                component: ComponentCreator('/docs/guides/basic-integration', '3d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/custom-ui',
                component: ComponentCreator('/docs/guides/custom-ui', 'd85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/gestures',
                component: ComponentCreator('/docs/guides/gestures', '4c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/nextjs-integration',
                component: ComponentCreator('/docs/guides/nextjs-integration', '2f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/offline-support',
                component: ComponentCreator('/docs/guides/offline-support', '54d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/performance',
                component: ComponentCreator('/docs/guides/performance', '5ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/core',
                component: ComponentCreator('/docs/packages/core', 'e6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/embed',
                component: ComponentCreator('/docs/packages/embed', '334'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/feed',
                component: ComponentCreator('/docs/packages/feed', '2c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/gestures',
                component: ComponentCreator('/docs/packages/gestures', '23f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/player',
                component: ComponentCreator('/docs/packages/player', '637'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/packages/ui',
                component: ComponentCreator('/docs/packages/ui', 'c25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting',
                component: ComponentCreator('/docs/troubleshooting', 'ee8'),
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
