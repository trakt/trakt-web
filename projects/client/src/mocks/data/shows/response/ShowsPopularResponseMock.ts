import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock';
import type { ShowResponse } from '@trakt/api';

export const ShowsPopularResponseMock: ShowResponse[] = [
  ShowSiloResponseMock,
  ShowDevsResponseMock,
];
