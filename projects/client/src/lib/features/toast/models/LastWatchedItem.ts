import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type Movie = {
  type: 'movie';
  media: MovieEntry;
};

type Show = {
  type: 'show';
  media: ShowEntry;
};

export type LastWatchedItem = Movie | Show;
