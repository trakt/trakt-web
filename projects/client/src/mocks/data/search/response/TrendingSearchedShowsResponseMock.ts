import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { TrendingSearchShowResultResponse } from '@trakt/api';

export const TrendingSearchedShowsResponseMock:
  TrendingSearchShowResultResponse[] = [
    {
      id: ShowSiloResponseMock.ids.trakt,
      count: 200,
      type: 'show',
      show: ShowSiloResponseMock,
    },
  ];
