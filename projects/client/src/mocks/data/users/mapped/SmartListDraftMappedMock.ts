import type { SmartListDraft } from '$lib/requests/models/SmartListDraft.ts';

export const SmartListDraftMappedMock: SmartListDraft = {
  source: 'trending',
  mediaType: 'shows',
  filters: {
    genres: ['drama', 'science-fiction'],
    years: [2015, 2030],
    ratings: [70, 100],
  },
  confidence: 0.82,
};
