import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import type { MovieAnticipatedResponse } from '@trakt/api';

export const MoviesAnticipatedResponseMock: MovieAnticipatedResponse[] = [
  {
    list_count: 127434,
    movie: MovieHereticResponseMock,
  },
];
