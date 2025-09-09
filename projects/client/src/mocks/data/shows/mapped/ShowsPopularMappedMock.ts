import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ShowsPopularMappedMock: ShowEntry[] = [
  ShowSiloMappedMock,
  ShowDevsMappedMock,
];
