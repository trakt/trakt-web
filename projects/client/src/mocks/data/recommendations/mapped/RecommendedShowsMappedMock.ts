import type { RecommendedShow } from '$lib/requests/queries/recommendations/recommendedShowsQuery';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const RecommendedShowsMappedMock: RecommendedShow[] = [
  {
    ...ShowSiloMappedMock,
    'episode': {
      'count': 15,
    },
  },
];
