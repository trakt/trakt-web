import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock';
import type { PeopleMovieCreditsResponse } from '@trakt/api';

export const PersonGrantMovieCreditsResponseMock: PeopleMovieCreditsResponse = {
  'cast': [
    {
      'character': 'Mr. Reed',
      'characters': [
        'Mr. Reed',
      ],
      'movie': MovieHereticResponseMock,
    },
  ],
};
