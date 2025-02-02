import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock';
import type { SearchResultResponse } from '@trakt/api';

export const SearchHereticResponseMock: SearchResultResponse = [
  {
    type: 'movie',
    score: 110.041016,
    movie: MovieHereticResponseMock,
  },
];
