import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { Snippet } from 'svelte';
import type { MediaGlanceQueries } from './useMediaGlance.ts';

export type MediaGlanceLoaderProps<T extends MediaEntry> = {
  slug: string;
  queries: MediaGlanceQueries<T>;
  details: Snippet<[T, MediaCrew, MediaIntl]>;
};
