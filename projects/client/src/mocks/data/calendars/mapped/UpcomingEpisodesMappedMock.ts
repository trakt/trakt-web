import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { EpisodeSiloMappedMock } from '../../summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';

export const UpcomingEpisodesMappedMock: UpcomingEpisodeEntry[] = [
  {
    ...EpisodeSiloMappedMock,
    show: ShowSiloMappedMock,
  },
];
