import type { HistoryEpisode } from '$lib/requests/queries/users/episodeHistoryQuery';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const HistoryEpisodesMappedMock: HistoryEpisode[] = [
  {
    'id': 1,
    'episode': EpisodeSiloMappedMock,
    'show': ShowSiloMappedMock,
    'type': 'episode',
    'watchedAt': new Date('2025-01-31T23:12:41.000Z'),
  },
];
