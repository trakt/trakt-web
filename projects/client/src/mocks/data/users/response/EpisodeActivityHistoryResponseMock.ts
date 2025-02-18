import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { EpisodeActivityHistoryResponse } from '@trakt/api';

export const EpisodeActivityHistoryResponseMock:
  EpisodeActivityHistoryResponse[] = [
    {
      'id': 1,
      'watched_at': '2025-01-31T23:12:41.000Z',
      'action': 'watch',
      'type': 'episode',
      'episode': EpisodeSiloResponseMock,
      'show': ShowSiloResponseMock,
    },
  ];
