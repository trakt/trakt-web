import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodePremiereType } from '$lib/requests/models/EpisodeType.ts';

export const EpisodeSiloMappedMock: EpisodeEntry = {
  'id': 5165667,
  'key': 'episode-5165667',
  'type': EpisodePremiereType.series_premiere,
  'title': 'Freedom Day',
  'overview':
    "Sheriff Becker's plans for the future are thrown off course after his wife meets a hacker with information about the silo.",
  'season': 1,
  'genres': [],
  'number': 1,
  'runtime': 60,
  'rating': 0.7753,
  'cover': {
    'url':
      'https://walter-r2.trakt.tv/images/episodes/005/165/667/screenshots/thumb/e035db5f06.jpg.webp',
  },
  'airDate': new Date('2023-05-05T01:00:00.000Z'),
  'year': 2023,
  'postCredits': [],
};
