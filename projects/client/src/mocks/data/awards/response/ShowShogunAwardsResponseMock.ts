import type { TitleAwardResponse } from '@trakt/api';

export const ShowShogunAwardsResponseMock: TitleAwardResponse[] = [
  {
    award: {
      slug: 'emmys-outstanding-drama-series',
      name: 'Outstanding Drama Series',
    },
    ceremony: {
      slug: 'emmys',
      name: 'Primetime Emmys',
      edition: 76,
      nominations_at: '2024-07-17',
      held_at: '2024-09-15',
    },
    year: 2024,
    won: true,
  },
];
