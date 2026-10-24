import type { RealityClaim } from '$lib/requests/models/RealityCheck.ts';

export const MOCK_REALITY_CLAIMS: RealityClaim[] = [
  {
    about: null,
    label: 'invented',
    impact: 'major',
    onScreen: 'The hero is betrayed by her closest friend.',
    documented: 'The friend never existed. She was invented for the film.',
  },
  {
    about: null,
    label: 'compressed',
    impact: 'minor',
    onScreen: 'Two court cases play out in a single hearing.',
    documented: 'There were two separate cases, settled months apart.',
  },
  {
    about: null,
    label: 'accurate',
    impact: 'major',
    onScreen: 'The company freezes its main bank account.',
    documented: 'The account was frozen, as shown.',
  },
];
