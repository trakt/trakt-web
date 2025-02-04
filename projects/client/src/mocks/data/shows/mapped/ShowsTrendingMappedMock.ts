import type { TrendingShow } from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

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
