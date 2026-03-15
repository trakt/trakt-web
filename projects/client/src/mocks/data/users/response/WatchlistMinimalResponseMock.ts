import { MovieMatrixResponseMock } from '../../summary/movies/matrix/MovieMatrixResponseMock.ts';
import { ShowSiloMinimalResponseMock } from '../../summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';

export const WatchlistMinimalResponseMock = {
  movies: [MovieMatrixResponseMock.ids.trakt],
  shows: [ShowSiloMinimalResponseMock.ids.trakt],
};
