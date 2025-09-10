import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

type Episode = {
  type: 'episode';
  media: EpisodeEntry;
  show: ShowEntry;
};

type Movie = {
  type: 'movie';
  media: MovieEntry;
};

export type LastWatchedItem = Episode | Movie;
