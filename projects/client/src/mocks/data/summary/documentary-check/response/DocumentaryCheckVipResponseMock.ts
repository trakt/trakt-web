import type { DocumentaryCheckResponse } from '$lib/requests/models/DocumentaryCheckResponse.ts';
import { DocumentaryCheckPublicResponseMock } from './DocumentaryCheckPublicResponseMock.ts';

export const DocumentaryCheckVipResponseMock: DocumentaryCheckResponse = {
  ...DocumentaryCheckPublicResponseMock,
  disputes: [
    {
      claim: 'The film claims the river has lost most of its fish.',
      by: 'A university research group',
      type: 'expert',
      year: 2021,
      reply: null,
      impact: 'minor',
    },
    {
      claim: 'The film claims the plant dumps waste every night.',
      by: 'A regional newspaper',
      type: 'press',
      year: null,
      reply:
        'The filmmakers say the footage was filmed on three separate nights.',
      impact: 'major',
    },
  ],
};
