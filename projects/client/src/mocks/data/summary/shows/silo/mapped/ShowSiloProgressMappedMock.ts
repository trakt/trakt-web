import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { EpisodeStandardType } from '$lib/requests/models/EpisodeType.ts';

export const ShowSiloProgressMappedMock: EpisodeProgressEntry = {
  'id': 12105048,
  'key': 'episode-12105048',
  'title': 'Order',
  'season': 2,
  'number': 2,
  'runtime': 42,
  'genres': [],
  'overview':
    "In Silo 18, shock and unrest take hold in the wake of Juliette doing what no one's done before.",
  'cover': {
    'url':
      'https://walter-r2.trakt.tv/images/episodes/012/105/048/screenshots/medium/2f894ac614.jpg.webp',
  },
  'airDate': new Date('2024-11-22T02:00:00.000Z'),
  'total': 17,
  'completed': 11,
  'remaining': 6,
  'minutesLeft': 301,
  'type': EpisodeStandardType.standard,
  'year': 2024,
  'postCredits': [],
};
