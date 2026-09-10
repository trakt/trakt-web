type ToWatchedGapPromptProps = {
  /**
   * The last watched state observed from a settled history, or `null` when
   * none has been observed yet.
   */
  baseline: boolean | null;
  isHistorySettled: boolean;
  isWatched: boolean;
  skippedCount: number;
};

type WatchedGapPrompt = {
  baseline: boolean | null;
  shouldPrompt: boolean;
};

/**
 * Whether an episode just became watched over a gap, and the baseline to carry
 * into the next read.
 *
 * The prompt follows the episode becoming watched rather than the click, so it
 * covers every route that marks it - the row check, the overflow, or the date
 * drawer - and stays quiet on a re-watch, since the state was already true.
 *
 * Only a settled history moves the baseline. `useIsWatched` reads an unsettled
 * history as "not watched", so a baseline taken from it would turn the history
 * arriving into a false -> true transition and prompt on an episode nobody
 * touched. Skipping those reads rather than resetting keeps the last settled
 * value in place, so a refetch passing back through an unsettled history still
 * leaves the user's own check as a transition across it.
 */
export function toWatchedGapPrompt({
  baseline,
  isHistorySettled,
  isWatched,
  skippedCount,
}: ToWatchedGapPromptProps): WatchedGapPrompt {
  if (!isHistorySettled) {
    return { baseline, shouldPrompt: false };
  }

  return {
    baseline: isWatched,
    shouldPrompt: baseline === false && isWatched && skippedCount > 0,
  };
}
