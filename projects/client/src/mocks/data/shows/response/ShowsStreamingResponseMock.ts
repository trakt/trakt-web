import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { ShowStreamingResponse } from '@trakt/api';

export const ShowsStreamingResponseMock: ShowStreamingResponse[] = [
  {
    rank: 42,
    delta: 1337,
    show: ShowSiloResponseMock,
  },
  {
    rank: 180,
    delta: 0,
    show: ShowDevsResponseMock,
  },
];
