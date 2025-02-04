import type { RecommendedShow } from '$lib/requests/queries/recommendations/recommendedShowsQuery.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const RecommendedShowsMappedMock: RecommendedShow[] = [
  {
    ...ShowSiloMappedMock,
    'episode': {
      'count': 15,
    },
  },
];
