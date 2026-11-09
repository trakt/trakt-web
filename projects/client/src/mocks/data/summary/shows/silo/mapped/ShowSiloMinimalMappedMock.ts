import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';

export const ShowSiloMinimalMappedMock: ShowEntry = {
  airDate: MAX_DATE,
  releaseDate: MAX_DATE,
  effectiveReleaseDate: MAX_DATE,
  certification: undefined,
  country: undefined,
  cover: {
    url: {
      medium:
        'https://media.trakt.tv/shows/180770/medium/fanart.webp' as HttpsUrl,
      thumb:
        'https://media.trakt.tv/shows/180770/thumb/fanart.webp' as HttpsUrl,
    },
  },
  logo: {
    url: {
      medium:
        'https://media.trakt.tv/shows/180770/medium/logo.webp' as HttpsUrl,
      thumb: 'https://media.trakt.tv/shows/180770/medium/logo.webp' as HttpsUrl,
    },
  },
  genres: [],
  id: 180770,
  key: 'show-180770',
  languages: undefined,
  overview: 'TBD',
  poster: {
    url: {
      medium:
        'https://media.trakt.tv/shows/180770/medium/poster.webp' as HttpsUrl,
      thumb:
        'https://media.trakt.tv/shows/180770/thumb/poster.webp' as HttpsUrl,
    },
  },
  runtime: NaN,
  slug: 'silo',
  status: 'unknown',
  rating: undefined,
  tagline: '',
  thumb: {
    url: 'https://media.trakt.tv/shows/180770/medium/thumb.webp' as HttpsUrl,
  },
  title: 'Silo',
  originalTitle: undefined,
  trailer: undefined,
  type: 'show',
  votes: 0,
  year: 2023,
  colors: ['#D29D40', '#1E2E2F'],
  network: undefined,
  plexSlug: undefined,
  postCredits: [],
  episode: {
    count: 20,
  },
  totalRuntime: NaN,
  imdbId: 'tt14688458',
  tmdbId: 125988,
  homepage: undefined,
  socialMedia: undefined,
  airs: undefined,
};
