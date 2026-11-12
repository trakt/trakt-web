import type { DocumentaryDispute } from '$lib/requests/models/DocumentaryCheck.ts';

export const MOCK_DOCUMENTARY_DISPUTES: DocumentaryDispute[] = [
  {
    claim: 'The film claims the river has lost most of its fish.',
    by: 'A university research group',
    type: 'expert',
    year: 2021,
    reply: null,
    impact: 'major',
  },
  {
    claim: 'The film claims the plant dumps waste every night.',
    by: 'A regional newspaper',
    type: 'press',
    year: 2021,
    reply: null,
    impact: 'major',
  },
  {
    claim: "The film's account of the industry's own safety record.",
    by: 'An industry group',
    type: 'interested',
    year: 2021,
    reply: 'The filmmakers say the film stands by its sources.',
    impact: 'minor',
  },
];
