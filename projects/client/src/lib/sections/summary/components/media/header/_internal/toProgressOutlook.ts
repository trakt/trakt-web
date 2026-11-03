import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';

type ProgressOutlook = {
  /** The episode to watch next, or null when nothing aired is left. */
  next: { kicker: string; label: string } | null;
  /** Watched share of the aired episodes, 0 to 1. */
  fraction: number;
  /** "11 of 16 · last seen S2 · E3", or "0 of 16 · not started". */
  foot: string;
};

/**
 * What the Progress column says: the episode to watch next, how far through
 * the show the viewer is, and the last episode they saw, demoted to one line.
 * A progress entry without a next episode carries id -1.
 */
export function toProgressOutlook(
  progress: EpisodeProgressEntry,
): ProgressOutlook {
  const isStarted = progress.completed > 0;
  const hasNext = progress.id > 0 && progress.remaining > 0;
  const lastEpisode = progress.lastEpisode;

  const count = m.text_recap_progress_count({
    watched: progress.completed,
    total: progress.total,
  });

  const lastSeen = lastEpisode && lastEpisode.season >= 0
    ? m.text_recap_last_seen_episode({
      episode: episodeNumberLabel({
        seasonNumber: lastEpisode.season,
        episodeNumber: lastEpisode.number,
      }),
    })
    : null;

  const status = isStarted ? lastSeen : m.text_recap_not_started();

  return {
    next: hasNext
      ? {
        kicker: isStarted ? m.text_recap_up_next() : m.text_recap_start_with(),
        label: episodeNumberLabel({
          seasonNumber: progress.season,
          episodeNumber: progress.number,
        }),
      }
      : null,
    fraction: progress.total > 0
      ? Math.min(progress.completed / progress.total, 1)
      : 0,
    foot: status
      ? m.text_recap_meta_pair({ first: count, second: status })
      : count,
  };
}
