import type { TranslationResponse } from '@trakt/api';

export const ShowSiloTranslationsResponseMock: Map<
  string,
  TranslationResponse
> = new Map([
  [
    'en',
    [{
      'title': 'Silo',
      'overview':
        'In a ruined and toxic future, thousands live in a giant silo deep underground. After its sheriff breaks a cardinal rule and residents die mysteriously, engineer Juliette starts to uncover shocking secrets and the truth about the silo.',
      'tagline': 'The truth will surface.',
      'language': 'en',
      'country': 'us',
    }],
  ],
  [
    'nl',
    [{
      'title': null,
      'overview':
        'In een verwoeste, vergiftigde toekomst leven duizenden mensen in een enorme silo onder de grond. Nadat de sheriff een belangrijke regel overtreedt en inwoners onverklaard overlijden, ontrafelt de technicus Juliette schokkende geheimen en de waarheid over de silo.',
      'tagline': 'Om te leven heb je iets nodig om voor te sterven.',
      'language': 'nl',
      'country': 'nl',
    }],
  ],
  [
    'ja',
    [{
      'title': 'サイロ',
      'overview':
        '有毒物質が蔓延する荒廃した未来。何千人もの人間が地下深くに広がる巨大なサイロで暮らしている。保安官が基本的な規則を破り、住民たちが謎の死を遂げる中、機械工のジュリエットはサイロの驚くべき秘密と真実を解き明かしていく。',
      'tagline': '生きるために、命をかけて追い求める。',
      'language': 'ja',
      'country': 'jp',
    }],
  ],
]);
