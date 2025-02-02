import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock';
import type { HistoryEpisodesResponse } from '@trakt/api';

export const HistoryEpisodesResponseMock: HistoryEpisodesResponse[] = [
  {
    'id': 1,
    'watched_at': '2025-01-31T23:12:41.000Z',
    'action': 'watch',
    'type': 'episode',
    'episode': EpisodeSiloResponseMock,
    'show': ShowSiloResponseMock,
  },
];
