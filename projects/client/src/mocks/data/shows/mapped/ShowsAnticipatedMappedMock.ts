import type { AnticipatedShow } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ShowsAnticipatedMappedMock: AnticipatedShow[] = [
  {
    ...ShowSiloMappedMock,
    score: 127434,
    episode: {
      count: 15,
    },
  },
  {
    ...ShowDevsMappedMock,
    score: 12,
    episode: {
      count: 8,
    },
  },
];
