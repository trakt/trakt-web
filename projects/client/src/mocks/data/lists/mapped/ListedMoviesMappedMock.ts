import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const ListedMoviesMappedMock: ListItem[] = [
  {
    'entry': MovieHereticMappedMock,
    'id': 1146014560,
    'key': 'movie-1146014560',
    'listedAt': new Date('2024-12-27T21:34:14.000Z'),
    'notes': null,
    'rank': 1,
    'type': 'movie',
  },
];
