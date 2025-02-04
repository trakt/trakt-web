import type { AnticipatedMovie } from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const MoviesAnticipatedMappedMock: AnticipatedMovie[] = [
  {
    ...MovieHereticMappedMock,
    score: 127434,
  },
];
