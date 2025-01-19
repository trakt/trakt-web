import type { EpisodeEntry } from '$lib/models/EpisodeEntry';
import { EpisodePremiereType } from '$lib/models/EpisodeType';

export const EpisodeSiloMappedMock: EpisodeEntry = {
  'id': 5165667,
  'type': EpisodePremiereType.Series,
  'title': 'Freedom Day',
  'overview':
    "Sheriff Becker's plans for the future are thrown off course after his wife meets a hacker with information about the silo.",
  'season': 1,
  'genres': [],
  'number': 1,
  'runtime': 60,
  'cover': {
    'url':
      'https://walter-r2.trakt.tv/images/episodes/005/165/667/screenshots/thumb/e035db5f06.jpg.webp',
  },
  'airDate': new Date('2023-05-05T01:00:00.000Z'),
  'year': 2023,
};
