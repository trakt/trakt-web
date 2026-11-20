import type { SpotlightAction } from '$lib/features/spotlight/models/SpotlightAction.ts';
import { devtoolsEntries } from './_internal/devtoolsEntries.ts';
import { devtoolsStore } from './devtoolsStore.ts';
import { DEVTOOLS_TITLE } from './devtoolsTitle.ts';

export const devtoolsSpotlightActions: ReadonlyArray<SpotlightAction> = [
  {
    id: 'devtools',
    label: () => DEVTOOLS_TITLE,
    keywords: ['devtools', 'dev tools', 'debug', 'tooling'],
    run: devtoolsStore.openDrawer,
  },
  ...devtoolsEntries.map(({ id, title, keywords, run }) => ({
    id,
    label: () => title,
    keywords,
    run,
  })),
];
