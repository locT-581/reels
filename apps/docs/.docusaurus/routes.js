import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/en/search',
    component: ComponentCreator('/en/search', '5d6'),
    exact: true
  },
  {
    path: '/en/docs',
    component: ComponentCreator('/en/docs', 'd1f'),
    routes: [
      {
        path: '/en/docs',
        component: ComponentCreator('/en/docs', 'dbe'),
        routes: [
          {
            path: '/en/docs',
            component: ComponentCreator('/en/docs', '8fb'),
            routes: [
              {
                path: '/en/docs/',
                component: ComponentCreator('/en/docs/', '995'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/components',
                component: ComponentCreator('/en/docs/api/components', 'aee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/hooks',
                component: ComponentCreator('/en/docs/api/hooks', 'a28'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/stores',
                component: ComponentCreator('/en/docs/api/stores', 'f5c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/types',
                component: ComponentCreator('/en/docs/api/types', '82d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/utilities',
                component: ComponentCreator('/en/docs/api/utilities', '73a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/changelog',
                component: ComponentCreator('/en/docs/changelog', '5da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/basic-feed',
                component: ComponentCreator('/en/docs/examples/basic-feed', 'e44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/custom-actions',
                component: ComponentCreator('/en/docs/examples/custom-actions', '014'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/infinite-scroll',
                component: ComponentCreator('/en/docs/examples/infinite-scroll', '991'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/single-player',
                component: ComponentCreator('/en/docs/examples/single-player', '585'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/installation',
                component: ComponentCreator('/en/docs/getting-started/installation', '15f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/project-structure',
                component: ComponentCreator('/en/docs/getting-started/project-structure', '26f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/quick-start',
                component: ComponentCreator('/en/docs/getting-started/quick-start', '921'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/basic-integration',
                component: ComponentCreator('/en/docs/guides/basic-integration', 'e10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/custom-ui',
                component: ComponentCreator('/en/docs/guides/custom-ui', '3dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/gestures',
                component: ComponentCreator('/en/docs/guides/gestures', '012'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/nextjs-integration',
                component: ComponentCreator('/en/docs/guides/nextjs-integration', '60c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/offline-support',
                component: ComponentCreator('/en/docs/guides/offline-support', 'b8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/performance',
                component: ComponentCreator('/en/docs/guides/performance', 'fe3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/core',
                component: ComponentCreator('/en/docs/packages/core', '77e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/embed',
                component: ComponentCreator('/en/docs/packages/embed', '0c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/feed',
                component: ComponentCreator('/en/docs/packages/feed', '37e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/gestures',
                component: ComponentCreator('/en/docs/packages/gestures', 'f9a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/player',
                component: ComponentCreator('/en/docs/packages/player', '9a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/ui',
                component: ComponentCreator('/en/docs/packages/ui', '101'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/troubleshooting',
                component: ComponentCreator('/en/docs/troubleshooting', '974'),
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
    path: '/en/',
    component: ComponentCreator('/en/', '6c2'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
