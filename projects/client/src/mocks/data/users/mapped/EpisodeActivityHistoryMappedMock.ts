import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const EpisodeActivityHistoryMappedMock: EpisodeActivityHistory[] = [
  {
    'id': 1,
    'episode': {
      ...EpisodeSiloMappedMock,
      'show': ShowSiloMappedMock,
    },
    'type': 'episode',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
