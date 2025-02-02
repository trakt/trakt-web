import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock';
import type { RecommendedShowResponse } from '@trakt/api';

export const RecommendedShowsResponseMock: RecommendedShowResponse = [
  {
    ...ShowSiloResponseMock,
    'favorited_by': [],
    'recommended_by': [],
  },
];
