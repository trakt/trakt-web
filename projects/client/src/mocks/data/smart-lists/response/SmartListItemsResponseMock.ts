import type { SmartListItemResponse } from '$lib/requests/queries/smart-lists/smartListItemsQuery.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';

export const SmartListItemsResponseMock: SmartListItemResponse[] = [
  {
    rank: 1,
    type: 'show',
    show: ShowSiloResponseMock,
  },
  {
    rank: 2,
    type: 'movie',
    movie: MovieHereticResponseMock,
  },
];
