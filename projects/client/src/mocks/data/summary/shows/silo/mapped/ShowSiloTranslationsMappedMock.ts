import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';

export const ShowSiloTranslationsMappedMock: Map<string, MediaIntl> = new Map([
  [
    'en',
    {
      'overview':
        'In a ruined and toxic future, thousands live in a giant silo deep underground. After its sheriff breaks a cardinal rule and residents die mysteriously, engineer Juliette starts to uncover shocking secrets and the truth about the silo.',
      'tagline': 'The truth will surface.',
      'title': 'Silo',
      'country': 'us',
    },
  ],
  [
    'nl',
    {
      'overview':
        'In een verwoeste, vergiftigde toekomst leven duizenden mensen in een enorme silo onder de grond. Nadat de sheriff een belangrijke regel overtreedt en inwoners onverklaard overlijden, ontrafelt de technicus Juliette schokkende geheimen en de waarheid over de silo.',
      'tagline': 'Om te leven heb je iets nodig om voor te sterven.',
      'title': null,
      'country': 'nl',
    },
  ],
  [
    'ja',
    {
      'overview':
        '有毒物質が蔓延する荒廃した未来。何千人もの人間が地下深くに広がる巨大なサイロで暮らしている。保安官が基本的な規則を破り、住民たちが謎の死を遂げる中、機械工のジュリエットはサイロの驚くべき秘密と真実を解き明かしていく。',
      'tagline': '生きるために、命をかけて追い求める。',
      'title': 'サイロ',
      'country': 'jp',
    },
  ],
]);
