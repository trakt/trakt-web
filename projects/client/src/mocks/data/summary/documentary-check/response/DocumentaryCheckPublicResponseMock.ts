import type { DocumentaryCheckResponse } from '$lib/requests/models/DocumentaryCheckResponse.ts';

export const DocumentaryCheckPublicResponseMock = {
  applicable: true,
  tier: 'wide',
  summary:
    'A university research group and two news outlets disputed central claims.',
  makers: {
    madeBy: ['Example Films'],
    fundedBy: ['Example Foundation'],
  },
} satisfies DocumentaryCheckResponse;
