import type { PopularShow } from '$lib/requests/queries/shows/showPopularQuery.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ShowsPopularMappedMock: PopularShow[] = [
  {
    ...ShowSiloMappedMock,
    episode: {
      count: 15,
    },
  },
  {
    ...ShowDevsMappedMock,
    episode: {
      count: 8,
    },
  },
];
