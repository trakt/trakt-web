import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const UpNextMappedMock: UpNextEntry[] = [
  {
    'intent': 'continue',
    'completed': 0,
    'remaining': 20,
    'show': ShowSiloMappedMock,
    'total': 20,
    'minutesLeft': 471,
    'lastWatchedAt': new Date('2025-01-28T12:53:21.000Z'),
    ...EpisodeSiloMappedMock,
  },
];
