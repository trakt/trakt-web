import type { DocumentaryCheck } from '$lib/requests/models/DocumentaryCheck.ts';

export const DocumentaryCheckPublicMappedMock: DocumentaryCheck = {
  kind: 'documentary',
  tier: 'wide',
  summary:
    'A university research group and two news outlets disputed central claims.',
  makers: {
    madeBy: ['Example Films'],
    fundedBy: ['Example Foundation'],
  },
  disputes: [],
};
