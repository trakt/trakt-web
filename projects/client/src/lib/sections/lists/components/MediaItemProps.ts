import type { MediaType } from '$lib/models/MediaType';
import type { EpisodeCount } from '$lib/requests/models/EpisodeCount';
import type { MovieSummary } from '$lib/requests/models/MovieSummary';
import type { ShowSummary } from '$lib/requests/models/ShowSummary';
import type { Snippet } from 'svelte';

export type MediaItemProps = {
  media: MovieSummary | (ShowSummary & EpisodeCount);
  type: MediaType;
  tags?: Snippet<[MediaItemProps['media']]>;
};
