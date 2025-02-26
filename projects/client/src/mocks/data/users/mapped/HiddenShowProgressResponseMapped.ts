import type { HiddenShow } from '$lib/requests/models/HiddenShow.ts';
import { ShowSiloMinimalMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMinimalMappedMock.ts';

export const HiddenShowProgressResponseMapped: HiddenShow[] = [
  {
    'hiddenAt': new Date('2025-02-26T12:55:10.000Z'),
    'show': ShowSiloMinimalMappedMock,
  },
];
