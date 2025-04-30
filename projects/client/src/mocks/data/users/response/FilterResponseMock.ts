import type { FilterResponse } from '@trakt/api';
export const FilterResponseMock: FilterResponse[] = [
  {
    rank: 1,
    id: 21230,
    section: 'shows',
    name: '[Smart] Top Science Fiction Series',
    path: '/shows/trending',
    query:
      'genres=science-fiction&ratings=80-100&imdb_ratings=8.0-10.0&rt_meters=80-100&rt_user_meters=80-100',
    updated_at: '2025-04-30T12:42:42.000Z',
  },
  {
    rank: 1,
    id: 21229,
    section: 'movies',
    name: '[Smart] Top Adventure Movies',
    path: '/movies/trending',
    query:
      'genres=adventure,comedy&years=2010-2030&runtimes=115-500&ratings=60-100&imdb_ratings=7.0-10.0&rt_meters=75-100',
    updated_at: '2025-04-30T12:39:22.000Z',
  },
];
