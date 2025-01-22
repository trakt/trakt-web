import type { EpisodeCount } from '$lib/requests/models/EpisodeCount';
import type { MovieEntry } from '$lib/requests/models/MovieEntry';
import type { ShowEntry } from '$lib/requests/models/ShowEntry';

export type MediaInputDefault = MovieEntry | (ShowEntry & EpisodeCount);
export type MediaInput<T = MediaInputDefault> = {
  media: T;
};
