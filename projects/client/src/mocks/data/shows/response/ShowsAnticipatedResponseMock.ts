import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { ShowAnticipatedResponse } from '@trakt/api';

export const ShowsAnticipatedResponseMock: ShowAnticipatedResponse[] = [
  {
    list_count: 127434,
    show: ShowSiloResponseMock,
  },
  {
    list_count: 12,
    show: ShowDevsResponseMock,
  },
];
