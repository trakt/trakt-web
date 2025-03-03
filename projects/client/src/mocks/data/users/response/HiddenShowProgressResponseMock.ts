import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import type { HiddenShowItemResponse } from '@trakt/api';

export const HiddenShowProgressResponseMock: HiddenShowItemResponse[] = [
  {
    'hidden_at': '2025-02-26T12:55:10.000Z',
    'type': 'show',
    'show': ShowSiloMinimalResponseMock,
  },
];
