import * as m from '$lib/features/i18n/messages.ts';
import type { SyncCounts } from '$lib/requests/models/DataSync.ts';

export type SyncCountLabel = { key: string; label: string };

/**
 * Turns a per-section count block into a list of human-readable count labels,
 * omitting empty media types (matching the v2 syncs table).
 */
export function toSyncCountLabels(counts: SyncCounts | Nil): SyncCountLabel[] {
  if (!counts) {
    return [];
  }

  const labels: SyncCountLabel[] = [];

  if (counts.movies) {
    labels.push({
      key: 'movies',
      label: m.text_streaming_count_movies({ count: counts.movies }),
    });
  }
  if (counts.shows) {
    labels.push({
      key: 'shows',
      label: m.text_streaming_count_shows({ count: counts.shows }),
    });
  }
  if (counts.seasons) {
    labels.push({
      key: 'seasons',
      label: m.text_streaming_count_seasons({ count: counts.seasons }),
    });
  }
  if (counts.episodes) {
    labels.push({
      key: 'episodes',
      label: m.text_streaming_count_episodes({ count: counts.episodes }),
    });
  }

  return labels;
}
