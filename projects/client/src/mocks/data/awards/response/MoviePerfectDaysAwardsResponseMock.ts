import type { TitleAwardResponse } from '@trakt/api';

export const MoviePerfectDaysAwardsResponseMock: TitleAwardResponse[] = [
  {
    award: {
      slug: 'oscars-best-international-feature-film',
      name: 'Best International Feature Film',
    },
    ceremony: {
      slug: 'oscars',
      name: 'Academy Awards',
      edition: 96,
      nominations_at: '2024-01-23',
      held_at: '2024-03-10',
    },
    year: 2024,
    won: false,
  },
];
