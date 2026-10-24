import type { RealityCheckResponse } from '$lib/requests/models/RealityCheckResponse.ts';

export const RealityCheckPublicResponseMock: RealityCheckResponse = {
  applicable: true,
  verdict: 'loose',
  story: 'loose',
  protagonists: [
    { name: 'Mark Zuckerberg', tier: 'loose' },
    { name: 'Eduardo Saverin', tier: 'mostly_true' },
    { name: 'Erica Albright', tier: 'unclear' },
  ],
  summary:
    'The film follows the real lawsuits but invents motivations and dialogue for dramatic effect.',
};
