import type { TranslationResponse } from '@trakt/api';

export const MovieHereticTranslationsResponseMock: Map<
  string,
  TranslationResponse
> = new Map([
  [
    'en',
    [{
      'title': null,
      'overview':
        'Two young missionaries are forced to prove their faith when they knock on the wrong door and are greeted by a diabolical Mr. Reed, becoming ensnared in his deadly game of cat-and-mouse.',
      'tagline': 'Question everything.',
      'language': 'en',
      'country': 'us',
    }],
  ],
  [
    'nl',
    [{
      'title': null,
      'overview':
        'Twee jonge missionarissen worden gedwongen om hun geloof te bewijzen wanneer ze aankloppen bij de verkeerde deur, begroet worden door de duivelse Mr. Reed en vervolgens verstrikt raken in zijn dodelijke kat-en-muisspel.',
      'tagline': null,
      'language': 'nl',
      'country': 'nl',
    }],
  ],
  [
    'pt',
    [{
      'title': 'Herege',
      'overview':
        'Duas jovens missionárias são forçadas a provar sua fé quando batem na porta errada e são recebidas pelo diabólico Sr. Reed, ficando presas em seu jogo mortal de gato e rato.',
      'tagline': 'Questione tudo.',
      'language': 'pt',
      'country': 'br',
    }],
  ],
]);
