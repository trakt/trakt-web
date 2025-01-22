import type { ActiveWatcher } from '$lib/requests/models/ActiveWatcher';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry';
import type { EpisodeIntl } from '$lib/requests/models/EpisodeIntl';
import type { MediaEntry } from '$lib/requests/models/MediaEntry';
import type { MediaIntl } from '$lib/requests/models/MediaIntl';
import type { MediaRating } from '$lib/requests/models/MediaRating';
import type { MediaStats } from '$lib/requests/models/MediaStats';
import type { Season } from '$lib/requests/models/Season';
import type { Snippet } from 'svelte';

export type EpisodeSummaryProps = {
  episode: EpisodeEntry;
  show: MediaEntry;
  showIntl: MediaIntl;
  seasons: Season[];
  ratings: MediaRating;
  watchers: ActiveWatcher[];
  stats: MediaStats;
  episodeIntl: EpisodeIntl;
  actions?: Snippet;
};
