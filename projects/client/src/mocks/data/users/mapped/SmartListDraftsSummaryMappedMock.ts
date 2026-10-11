import type { SmartListDraftsSummary } from '$lib/requests/models/SmartListDraftsSummary.ts';

export const SmartListDraftsSummaryMappedMock: SmartListDraftsSummary = {
  convertibleCount: 3,
  bestConfidence: 0.93,
  lists: [
    {
      slug: 'silos',
      name: 'Silos',
      count: 40,
      confidence: 0.93,
    },
    {
      slug: 'slow-burn-sci-fi',
      name: null,
      count: 450,
      confidence: 0.82,
    },
    {
      slug: 'cozy-mysteries',
      name: 'Cozy mysteries',
      count: null,
      confidence: 0.61,
    },
  ],
};
