import type { PersonAwardResponse } from '@trakt/api';

export const PersonGiamattiAwardsResponseMock: PersonAwardResponse[] = [
  {
    award: {
      slug: 'oscars-best-actor',
      name: 'Best Actor',
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
    movie: {
      title: 'The Holdovers',
      year: 2023,
      ids: {
        trakt: 9022,
        slug: 'the-holdovers-2023',
      },
    },
  },
  {
    award: {
      slug: 'oscars-best-supporting-actor',
      name: 'Best Supporting Actor',
    },
    ceremony: {
      slug: 'oscars',
      name: 'Academy Awards',
      edition: 78,
      nominations_at: null,
      held_at: null,
    },
    year: 2006,
    won: false,
    movie: {
      title: 'Cinderella Man',
      year: 2005,
      ids: {
        trakt: 9023,
        slug: 'cinderella-man-2005',
      },
    },
  },
];
