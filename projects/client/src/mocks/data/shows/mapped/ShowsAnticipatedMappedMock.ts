import type { AnticipatedShow } from '$lib/requests/queries/shows/showAnticipatedQuery';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

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
