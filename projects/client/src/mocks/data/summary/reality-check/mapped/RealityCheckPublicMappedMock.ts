import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';

export const RealityCheckPublicMappedMock: RealityCheck = {
  verdict: 'loose',
  story: 'loose',
  protagonists: [
    { name: 'Mark Zuckerberg', tier: 'loose' },
    { name: 'Eduardo Saverin', tier: 'mostly_true' },
    { name: 'Erica Albright', tier: 'unclear' },
  ],
  summary:
    'The film follows the real lawsuits but invents motivations and dialogue for dramatic effect.',
  detail: null,
};
