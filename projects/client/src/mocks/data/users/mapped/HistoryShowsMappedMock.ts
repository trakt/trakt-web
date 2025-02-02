import type { HistoryShow } from '$lib/requests/queries/users/showHistoryQuery';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const HistoryShowsMappedMock: HistoryShow[] = [
  {
    'id': 1,
    'episode': EpisodeSiloMappedMock,
    'show': ShowSiloMappedMock,
    'type': 'show',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
