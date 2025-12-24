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
    component: ComponentCreator('/en/docs', 'b30'),
    routes: [
      {
        path: '/en/docs',
        component: ComponentCreator('/en/docs', '7ba'),
        routes: [
          {
            path: '/en/docs',
            component: ComponentCreator('/en/docs', '7d1'),
            routes: [
              {
                path: '/en/docs/',
                component: ComponentCreator('/en/docs/', 'cd8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/components',
                component: ComponentCreator('/en/docs/api/components', '66e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/hooks',
                component: ComponentCreator('/en/docs/api/hooks', '718'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/stores',
                component: ComponentCreator('/en/docs/api/stores', '2e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/types',
                component: ComponentCreator('/en/docs/api/types', '9d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/api/utilities',
                component: ComponentCreator('/en/docs/api/utilities', '36d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/changelog',
                component: ComponentCreator('/en/docs/changelog', '843'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/basic-feed',
                component: ComponentCreator('/en/docs/examples/basic-feed', '226'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/custom-actions',
                component: ComponentCreator('/en/docs/examples/custom-actions', '348'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/infinite-scroll',
                component: ComponentCreator('/en/docs/examples/infinite-scroll', '640'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/examples/single-player',
                component: ComponentCreator('/en/docs/examples/single-player', 'a4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/installation',
                component: ComponentCreator('/en/docs/getting-started/installation', '00f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/project-structure',
                component: ComponentCreator('/en/docs/getting-started/project-structure', '3a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/getting-started/quick-start',
                component: ComponentCreator('/en/docs/getting-started/quick-start', '856'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/basic-integration',
                component: ComponentCreator('/en/docs/guides/basic-integration', 'c47'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/custom-ui',
                component: ComponentCreator('/en/docs/guides/custom-ui', 'c16'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/gestures',
                component: ComponentCreator('/en/docs/guides/gestures', '816'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/nextjs-integration',
                component: ComponentCreator('/en/docs/guides/nextjs-integration', '644'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/offline-support',
                component: ComponentCreator('/en/docs/guides/offline-support', '0aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/guides/performance',
                component: ComponentCreator('/en/docs/guides/performance', 'ced'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/core',
                component: ComponentCreator('/en/docs/packages/core', '9b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/embed',
                component: ComponentCreator('/en/docs/packages/embed', 'fb7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/feed',
                component: ComponentCreator('/en/docs/packages/feed', 'c4d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/gestures',
                component: ComponentCreator('/en/docs/packages/gestures', '37f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/player',
                component: ComponentCreator('/en/docs/packages/player', '104'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/packages/ui',
                component: ComponentCreator('/en/docs/packages/ui', '2c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/en/docs/troubleshooting',
                component: ComponentCreator('/en/docs/troubleshooting', '856'),
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
