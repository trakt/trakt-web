import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { PeopleShowCreditsResponse } from '@trakt/api';

export const PersonFergusonShowCreditsResponseMock: PeopleShowCreditsResponse =
  {
    'cast': [
      {
        'character': 'Juliette Nichols',
        'characters': [
          'Juliette Nichols',
        ],
        'episode_count': 20,
        'series_regular': true,
        'show': ShowSiloResponseMock,
      },
    ],
  };
