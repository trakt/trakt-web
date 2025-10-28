import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ShowActivityHistoryMappedMock: ShowActivityHistory[] = [
  {
    'id': 1,
    'key': 'episode-1',
    'episode': EpisodeSiloMappedMock,
    'show': ShowSiloMappedMock,
    'type': 'episode',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
