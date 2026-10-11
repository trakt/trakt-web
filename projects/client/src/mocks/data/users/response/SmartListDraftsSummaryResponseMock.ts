export const SmartListDraftsSummaryResponseMock = {
  convertible_count: 3,
  best_confidence: 0.93,
  lists: [
    {
      ids: { trakt: 5678, slug: 'silos' },
      name: 'Silos',
      item_count: 40,
      confidence: 0.93,
    },
    {
      ids: { trakt: 5679, slug: 'slow-burn-sci-fi' },
      name: null,
      item_count: 450,
      confidence: 0.82,
    },
    {
      ids: { trakt: 5680, slug: 'cozy-mysteries' },
      name: 'Cozy mysteries',
      item_count: null,
      confidence: 0.61,
    },
  ],
};
