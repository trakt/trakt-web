import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';

export const SmartListDefinitionsMappedMock: SmartList[] = [
  {
    key: 'smart-list-smart-top-adventure-movies',
    title: '[Smart] Top Adventure Movies',
    slug: 'smart-top-adventure-movies',
    id: 21229,
    source: 'trending',
    mediaType: 'movies',
    privacy: 'public',
    filters: {
      genres: ['adventure', 'comedy'],
      years: [2010, 2030],
      runtimes: [115, 500],
      ratings: [60, 100],
      imdb_ratings: [7, 10],
      rt_meters: [75, 100],
    },
    posters: [],
    updatedAt: new Date('2025-04-30T12:39:22.000Z'),
  },
  {
    key: 'smart-list-smart-top-science-fiction-series',
    title: '[Smart] Top Science Fiction Series',
    slug: 'smart-top-science-fiction-series',
    id: 21230,
    source: 'trending',
    mediaType: 'shows',
    privacy: 'public',
    filters: {
      genres: ['science-fiction'],
      ratings: [80, 100],
      imdb_ratings: [8, 10],
      rt_meters: [80, 100],
      rt_user_meters: [80, 100],
    },
    posters: [],
    updatedAt: new Date('2025-04-30T12:42:42.000Z'),
  },
];
