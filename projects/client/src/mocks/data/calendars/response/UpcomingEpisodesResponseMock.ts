import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock';
import type { CalendarShowListResponse } from '@trakt/api';

export const UpcomingEpisodesResponseMock: CalendarShowListResponse = [
  {
    'first_aired': '2023-05-05T01:00:00.000Z',
    'episode': EpisodeSiloResponseMock,
    'show': ShowSiloResponseMock,
  },
];
