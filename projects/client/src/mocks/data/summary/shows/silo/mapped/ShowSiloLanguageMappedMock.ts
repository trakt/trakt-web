import type { MediaIntl } from '$lib/requests/models/MediaIntl';

export const ShowSiloLanguageMappedMock: Map<string, MediaIntl> = new Map([
  [
    'en',
    {
      'country': 'us',
      'language': 'en',
      'overview':
        'In a ruined and toxic future, thousands live in a giant silo deep underground. After its sheriff breaks a cardinal rule and residents die mysteriously, engineer Juliette starts to uncover shocking secrets and the truth about the silo.',
      'tagline': 'The truth will surface.',
      'title': 'Silo',
    },
  ],
  [
    'nl',
    {
      'country': 'nl',
      'language': 'nl',
      'overview':
        'In een verwoeste, vergiftigde toekomst leven duizenden mensen in een enorme silo onder de grond. Nadat de sheriff een belangrijke regel overtreedt en inwoners onverklaard overlijden, ontrafelt de technicus Juliette schokkende geheimen en de waarheid over de silo.',
      'tagline': 'Om te leven heb je iets nodig om voor te sterven.',
      'title': null,
    },
  ],
]);
