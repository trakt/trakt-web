import type { VisibleRange } from '$lib/utils/actions/trackVisibleRange.ts';

type HiddenEpisodeCountsParams = {
  total: number;
  range?: VisibleRange;
};

/**
 * How many episodes sit out of view before and after the visible range.
 * Without a measured range nothing is claimed hidden.
 */
export function getHiddenEpisodeCounts(
  { total, range }: HiddenEpisodeCountsParams,
) {
  if (!range) return { before: 0, after: 0 };

  return {
    before: Math.max(range.first, 0),
    after: Math.max(total - 1 - range.last, 0),
  };
}
