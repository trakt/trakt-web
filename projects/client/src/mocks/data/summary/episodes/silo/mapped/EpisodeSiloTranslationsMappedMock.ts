import type { EpisodeIntl } from '$lib/requests/models/EpisodeIntl.ts';

export const EpisodeSiloTranslationsMappedMock: Map<string, EpisodeIntl> =
  new Map([
    [
      'en',
      {
        'overview':
          "Sheriff Becker's plans for the future are thrown off course after his wife meets a hacker with information about the silo.",
        'title': 'Freedom Day',
        'country': 'us',
      },
    ],
    [
      'nl',
      {
        'overview':
          'Sheriff Beckers toekomstplannen worden verstoord als zijn vrouw een hacker ontmoet met informatie over de Silo.',
        'title': 'Vrijheidsdag',
        'country': 'nl',
      },
    ],
  ]);
