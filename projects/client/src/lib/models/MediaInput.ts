import type { EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type MediaInputDefault = MovieEntry | (ShowEntry & EpisodeCount);
export type MediaInput<T = MediaInputDefault> = {
  media: T;
};
