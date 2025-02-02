import type { PopularShow } from '$lib/requests/queries/shows/showPopularQuery';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

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
