import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';

export const MovieHereticLanguageMappedMock: Map<string, MediaIntl> = new Map([
  [
    'en',
    {
      'country': 'us',
      'language': 'en',
      'title': null,
      'overview':
        'Two young missionaries are forced to prove their faith when they knock on the wrong door and are greeted by a diabolical Mr. Reed, becoming ensnared in his deadly game of cat-and-mouse.',
      'tagline': 'Question everything.',
    },
  ],
  [
    'nl',
    {
      'country': 'nl',
      'language': 'nl',
      'title': null,
      'overview':
        'Twee jonge missionarissen worden gedwongen om hun geloof te bewijzen wanneer ze aankloppen bij de verkeerde deur, begroet worden door de duivelse Mr. Reed en vervolgens verstrikt raken in zijn dodelijke kat-en-muisspel.',
      'tagline': null,
    },
  ],
]);
