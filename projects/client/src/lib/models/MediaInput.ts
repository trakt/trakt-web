import type { EpisodeCount } from '$lib/requests/models/EpisodeCount';
import type { MovieSummary } from '$lib/requests/models/MovieSummary';
import type { ShowSummary } from '$lib/requests/models/ShowSummary';

export type MediaInputDefault = MovieSummary | (ShowSummary & EpisodeCount);
export type MediaInput<T = MediaInputDefault> = {
  media: T;
};
