import type { EpisodeTranslationResponse } from '@trakt/api';

export const EpisodeSiloTranslationsResponseMock: Map<
  string,
  EpisodeTranslationResponse
> = new Map([
  [
    'en',
    [{
      'title': 'Freedom Day',
      'overview':
        "Sheriff Becker's plans for the future are thrown off course after his wife meets a hacker with information about the silo.",
      'language': 'en',
      'country': 'us',
    }],
  ],
  [
    'nl',
    [{
      'title': 'Vrijheidsdag',
      'overview':
        'Sheriff Beckers toekomstplannen worden verstoord als zijn vrouw een hacker ontmoet met informatie over de Silo.',
      'language': 'nl',
      'country': 'nl',
    }],
  ],
]);
