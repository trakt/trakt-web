import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type MovieInput = MovieEntry;
export type ShowInput = ShowEntry;
export type MediaInputDefault = MovieEntry | ShowEntry;
export type BaseMediaInput<T = MediaInputDefault> = {
  media: T;
  type: MediaType;
};

export type MediaInput<T = MediaInputDefault> = BaseMediaInput<T> | {
  media: ShowEntry;
  episode: EpisodeEntry;
  type: 'episode';
};
