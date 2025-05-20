import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { Snippet } from 'svelte';

export type MediaSummaryProps<T> = {
  media: T;
  intl: MediaIntl;
  streamOn?: StreamOn;
  actions?: Snippet;
};
