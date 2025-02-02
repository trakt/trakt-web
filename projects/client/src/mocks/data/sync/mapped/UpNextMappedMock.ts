import type { UpNextEntry } from '$lib/requests/queries/sync/upNextQuery';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const UpNextMappedMock: UpNextEntry[] = [
  {
    'completed': 0,
    'remaining': 20,
    'show': ShowSiloMappedMock,
    'total': 20,
    'minutesLeft': 471,
    ...EpisodeSiloMappedMock,
  },
];
