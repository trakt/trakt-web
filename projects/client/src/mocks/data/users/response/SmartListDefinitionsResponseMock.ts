import type { SmartListDefinitionResponse } from '@trakt/api';

export const SmartListDefinitionsResponseMock: SmartListDefinitionResponse[] = [
  {
    name: '[Smart] Top Adventure Movies',
    privacy: 'public',
    created_at: '2025-04-30T12:39:22.000Z',
    updated_at: '2025-04-30T12:39:22.000Z',
    ids: {
      trakt: 21229,
      slug: 'smart-top-adventure-movies',
    },
    images: {
      posters: [],
    },
    source: 'trending',
    media_type: 'movies',
    filters: {
      genres: ['adventure', 'comedy'],
      years: [2010, 2030],
      runtimes: [115, 500],
      ratings: [60, 100],
      imdb_ratings: [7, 10],
      rt_meters: [75, 100],
    },
  },
  {
    name: '[Smart] Top Science Fiction Series',
    privacy: 'public',
    created_at: '2025-04-30T12:42:42.000Z',
    updated_at: '2025-04-30T12:42:42.000Z',
    ids: {
      trakt: 21230,
      slug: 'smart-top-science-fiction-series',
    },
    images: {
      posters: [],
    },
    source: 'trending',
    media_type: 'shows',
    filters: {
      genres: ['science-fiction'],
      ratings: [80, 100],
      imdb_ratings: [8, 10],
      rt_meters: [80, 100],
      rt_user_meters: [80, 100],
    },
  },
];
