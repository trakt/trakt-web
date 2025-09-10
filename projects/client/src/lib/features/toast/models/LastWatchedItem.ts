import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';

type Movie = {
  type: 'movie';
  media: MovieEntry;
};

export type LastWatchedItem = Movie;
