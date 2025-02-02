import type { TrendingShow } from '$lib/requests/queries/shows/showTrendingQuery';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const ShowsTrendingMappedMock: TrendingShow[] = [
  {
    ...ShowSiloMappedMock,
    watchers: 127434,
    episode: {
      count: 15,
    },
  },
  {
    ...ShowDevsMappedMock,
    watchers: 12,
    episode: {
      count: 8,
    },
  },
];
