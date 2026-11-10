import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export const PersonGiamattiAwardsMappedMock: AwardEntry[] = [
  {
    key: 'oscars-oscars-best-actor-2024-9022',
    category: 'Best Actor',
    ceremony: {
      key: 'oscars',
      slug: 'oscars',
      name: 'Academy Awards',
      edition: 96,
      nominationsAt: new Date('2024-01-23T00:00'),
      heldAt: new Date('2024-03-10T00:00'),
    },
    year: 2024,
    won: false,
    media: {
      type: 'movie',
      id: 9022,
      slug: 'the-holdovers-2023',
      title: 'The Holdovers',
      year: 2023,
      poster: {
        url: {
          medium: 'https://media.trakt.tv/movies/9022/medium/poster.webp',
          thumb: 'https://media.trakt.tv/movies/9022/thumb/poster.webp',
        },
      },
    },
  },
  {
    key: 'oscars-oscars-best-supporting-actor-2006-9023',
    category: 'Best Supporting Actor',
    ceremony: {
      key: 'oscars',
      slug: 'oscars',
      name: 'Academy Awards',
      edition: 78,
      nominationsAt: null,
      heldAt: null,
    },
    year: 2006,
    won: false,
    media: {
      type: 'movie',
      id: 9023,
      slug: 'cinderella-man-2005',
      title: 'Cinderella Man',
      year: 2005,
      poster: {
        url: {
          medium: 'https://media.trakt.tv/movies/9023/medium/poster.webp',
          thumb: 'https://media.trakt.tv/movies/9023/thumb/poster.webp',
        },
      },
    },
  },
];
