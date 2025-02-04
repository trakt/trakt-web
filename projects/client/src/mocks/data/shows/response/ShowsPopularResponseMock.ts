import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { ShowResponse } from '@trakt/api';

export const ShowsPopularResponseMock: ShowResponse[] = [
  ShowSiloResponseMock,
  ShowDevsResponseMock,
];
