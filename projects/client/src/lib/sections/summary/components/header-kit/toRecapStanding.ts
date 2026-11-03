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
 * Before the first episode the state is how much there is - the episode count
 * and its whole runtime - in a neutral pill: nothing is late yet.
 *
 * The time left is dropped when caught up (there is nothing left) and when the
 * runtime rounds to nothing, rather than printing a zero that reads as an
 * error.
 */
export type RecapStanding = {
  label: string;
  tone: 'behind' | 'caught-up' | 'neutral';
  timeLeft: string | null;
};

const toDuration = (minutes: number) =>
  toHumanDuration({ minutes, clampAt: 'day' });

function toNotStarted(progress: EpisodeProgressEntry): RecapStanding {
  return {
    label: progress.total === 1
      ? m.text_recap_episodes_one({ count: 1 })
      : m.text_recap_episodes({ count: progress.total }),
    tone: 'neutral',
    timeLeft: progress.minutesLeft > 0
      ? m.text_recap_time_total({ duration: toDuration(progress.minutesLeft) })
      : null,
  };
}

export function toRecapStanding(
  progress: EpisodeProgressEntry,
): RecapStanding {
  if (progress.completed === 0 && progress.total > 0) {
    return toNotStarted(progress);
  }

  const isBehind = progress.remaining > 0;

  const timeLeft = isBehind && progress.minutesLeft > 0
    ? m.text_recap_time_left({ duration: toDuration(progress.minutesLeft) })
    : null;

  return {
    label: isBehind
      ? m.text_recap_behind({ count: progress.remaining })
      : m.text_recap_caught_up(),
    tone: isBehind ? 'behind' : 'caught-up',
    timeLeft,
  };
}
