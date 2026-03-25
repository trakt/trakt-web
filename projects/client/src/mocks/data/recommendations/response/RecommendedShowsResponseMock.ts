import type { RecommendationsShowResponse } from '$lib/requests/models/RecommendationsResponse.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';

export const RecommendedShowsResponseMock: RecommendationsShowResponse = [
  {
    show: ShowSiloResponseMock,
    score: 8.5,
    sources: [],
  },
];
