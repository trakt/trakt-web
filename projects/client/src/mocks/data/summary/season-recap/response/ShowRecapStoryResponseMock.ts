import type { ShowRecapStoryResponse } from '$lib/requests/models/ShowRecapStoryResponse.ts';
import { SeasonRecapPublicResponseMock } from './SeasonRecapPublicResponseMock.ts';

export const ShowRecapStoryResponseMock: ShowRecapStoryResponse = {
  checkpoint: 2,
  segments: [
    { season: 1, text: 'Mark Scout leads a team at Lumon Industries.' },
    {
      season: 2,
      text: 'The team returns. See [Lumon](https://app.trakt.tv/shows/severance).',
    },
  ],
  latest: {
    whereThingsStand: SeasonRecapPublicResponseMock.whereThingsStand,
  },
};
