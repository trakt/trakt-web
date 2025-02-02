import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock';
import type { ShowTrendingResponse } from '@trakt/api';

export const ShowsTrendingResponseMock: ShowTrendingResponse[] = [
  {
    watchers: 127434,
    show: ShowSiloResponseMock,
  },
  {
    watchers: 12,
    show: ShowDevsResponseMock,
  },
];
