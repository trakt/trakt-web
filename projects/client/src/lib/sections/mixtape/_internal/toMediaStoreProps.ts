import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export function toMediaStoreProps(
  media: MovieEntry | ShowEntry,
): MediaStoreProps<MovieEntry | ShowEntry> {
  return media.type === 'movie'
    ? { type: 'movie', media }
    : { type: 'show', media };
}
