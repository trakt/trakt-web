import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

/**
 * Where the viewer stands with a show, as the header strip and the recap
 * drawer both say it: a state - behind by N, or up to date - and, when behind,
 * how long the catching up would take.
 *
 * One function so the two surfaces cannot disagree about a viewer's own
 * standing, which is the one figure on the page that is theirs alone.
 *
 * The time left is dropped when caught up (there is nothing left) and when the
 * runtime rounds to nothing, rather than printing a zero that reads as an
 * error.
 */
export type RecapStanding = {
  label: string;
  tone: 'behind' | 'caught-up';
  timeLeft: string | null;
};

export function toRecapStanding(
  progress: EpisodeProgressEntry,
): RecapStanding {
  const isBehind = progress.remaining > 0;

  const timeLeft = isBehind && progress.minutesLeft > 0
    ? m.text_recap_time_left({
      duration: toHumanDuration({
        minutes: progress.minutesLeft,
        clampAt: 'day',
      }),
    })
    : null;

  return {
    label: isBehind
      ? m.text_recap_behind({ count: progress.remaining })
      : m.text_recap_caught_up(),
    tone: isBehind ? 'behind' : 'caught-up',
    timeLeft,
  };
}
