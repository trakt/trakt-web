import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';

type ProgressOutlook = {
  /** The episode to watch next, or null when nothing aired is left. */
  next: { kicker: string; label: string } | null;
  /** The last episode seen, or null before the first one. */
  previous: {
    kicker: string;
    season: number;
    number: number;
    title: string | null;
    overview: string | null;
  } | null;
};

const toText = (value: string | Nil) => value?.trim() || null;

/**
 * What the Progress column says: the episode to watch next, and the one seen
 * last - its number, name and, when the API has one, its synopsis.
 * A progress entry without a next episode carries id -1.
 */
export function toProgressOutlook(
  progress: EpisodeProgressEntry,
): ProgressOutlook {
  const isStarted = progress.completed > 0;
  const hasNext = progress.id > 0 && progress.remaining > 0;
  const lastEpisode = progress.lastEpisode;
  const hasPrevious = isStarted && lastEpisode != null &&
    lastEpisode.season >= 0;

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
    previous: hasPrevious
      ? {
        kicker: m.text_recap_previously({
          episode: episodeNumberLabel({
            seasonNumber: lastEpisode.season,
            episodeNumber: lastEpisode.number,
          }),
        }),
        season: lastEpisode.season,
        number: lastEpisode.number,
        title: toText(lastEpisode.title),
        overview: toText(lastEpisode.overview),
      }
      : null,
  };
}
