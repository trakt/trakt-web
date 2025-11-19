import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { Snippet } from 'svelte';

export type CommonMediaSummaryProps = {
  intl: MediaIntl;
  streamOn?: StreamOn;
  contextualContent?: Snippet;
  crew: MediaCrew;
};
