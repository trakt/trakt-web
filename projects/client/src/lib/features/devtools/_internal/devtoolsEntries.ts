import { replayOnboarding } from '$lib/features/onboarding/replayOnboarding.ts';
import { devtoolsStore } from '../devtoolsStore.ts';
import type { DevtoolsEntry } from './DevtoolsEntry.ts';

export const devtoolsEntries: ReadonlyArray<DevtoolsEntry> = [
  {
    id: 'devtools-query',
    title: 'TanStack Query',
    description: 'Inspect query cache, fetch states and mutations.',
    keywords: ['query', 'queries', 'cache', 'tanstack', 'mutations'],
    run: () => devtoolsStore.openTool('query'),
  },
  {
    id: 'devtools-onboarding-replay',
    title: 'Replay getting started',
    description:
      'Reset getting-started progress and walk the steps again on this device.',
    keywords: ['onboarding', 'getting started', 'replay', 'first steps'],
    run: replayOnboarding,
  },
];
