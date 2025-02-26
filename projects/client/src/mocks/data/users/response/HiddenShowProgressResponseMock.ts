import type { HiddenShowItemResponse } from '$lib/api.ts';
import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';

export const HiddenShowProgressResponseMock: HiddenShowItemResponse[] = [
  {
    'hidden_at': '2025-02-26T12:55:10.000Z',
    'type': 'show',
    'show': ShowSiloMinimalResponseMock,
  },
];
