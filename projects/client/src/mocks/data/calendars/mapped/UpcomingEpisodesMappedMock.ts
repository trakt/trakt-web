import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock';

export const UpcomingEpisodesMappedMock: UpcomingEpisodeEntry[] = [
  {
    'airDate': new Date('2023-05-05T01:00:00.000Z'),
    'cover': {
      'url':
        'https://walter-r2.trakt.tv/images/episodes/005/165/667/screenshots/thumb/e035db5f06.jpg.webp',
    },
    'genres': [],
    'id': 5165667,
    'number': 1,
    'overview':
      "Sheriff Becker's plans for the future are thrown off course after his wife meets a hacker with information about the silo.",
    'runtime': 60,
    'season': 1,
    'title': 'Freedom Day',
    'type': 'series_premiere',
    'year': 2023,
    'show': ShowSiloMappedMock,
  },
];
