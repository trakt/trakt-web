import type { CalendarMovieResponse } from '@trakt/api';
import { MovieHereticResponseMock } from '../../summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const UpcomingMoviesResponseMock: CalendarMovieResponse[] = [
  {
    'released': '2024-11-08',
    'movie': MovieHereticResponseMock,
  },
];
