import type { AnticipatedMovie } from '$lib/requests/queries/movies/movieAnticipatedQuery';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';

export const MoviesAnticipatedMappedMock: AnticipatedMovie[] = [
  {
    ...MovieHereticMappedMock,
    score: 127434,
  },
];
