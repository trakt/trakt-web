import type { StreamingShow } from '$lib/requests/queries/shows/showStreamingQuery.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const ShowsStreamingMappedMock: StreamingShow[] = [
  {
    rank: 42,
    delta: 1337,
    ...ShowSiloMappedMock,
  },
  {
    rank: 180,
    delta: 0,
    ...ShowDevsMappedMock,
  },
];
