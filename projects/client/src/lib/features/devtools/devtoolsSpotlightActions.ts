import type { SpotlightAction } from '$lib/features/spotlight/models/SpotlightAction.ts';
import { devtoolsStore } from './devtoolsStore.ts';

export const devtoolsSpotlightActions: ReadonlyArray<SpotlightAction> = [
  {
    id: 'devtools',
    label: () => 'Devtools',
    keywords: ['devtools', 'dev tools', 'debug', 'tooling'],
    run: devtoolsStore.openDrawer,
  },
  {
    id: 'devtools-query',
    label: () => 'TanStack Query devtools',
    keywords: ['query', 'queries', 'cache', 'tanstack', 'mutations'],
    run: () => devtoolsStore.openTool('query'),
  },
];
