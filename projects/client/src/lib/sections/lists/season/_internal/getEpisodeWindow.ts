type EpisodeWindowParams = {
  /** How many episodes the season has. */
  total: number;
  /** How many slots the rail can show at this width. */
  slots: number;
  /**
   * Index of the episode the rail opens on - the one the viewer is up to.
   * Out-of-range or missing values open at the start.
   */
  anchorIndex?: number;
};

export type EpisodeWindow = {
  start: number;
  /** Exclusive, so it slices directly. */
  end: number;
  /** Episodes before the window - what the viewer has already passed. */
  before: number;
  /** Episodes after it - what is still to come. */
  after: number;
};

/**
 * Which slice of a season the rail shows, and what it is hiding either side.
 *
 * The rail opens on the episode the viewer is up to rather than on episode
 * one: a season is watched from the middle outwards, and a rail that always
 * starts at the beginning makes someone on episode 12 scroll past eleven they
 * have seen.
 *
 * The window is pulled back from the end so the last slots are never left
 * empty - reaching the finale should fill the row, not show one card and four
 * gaps.
 */
export function getEpisodeWindow(
  { total, slots, anchorIndex }: EpisodeWindowParams,
): EpisodeWindow {
  const size = Math.max(Math.min(slots, total), 0);

  if (size === 0) {
    return { start: 0, end: 0, before: 0, after: total };
  }

  const anchor = anchorIndex == null || anchorIndex < 0 ? 0 : anchorIndex;
  const start = Math.min(anchor, total - size);

  const end = start + size;

  return {
    start,
    end,
    before: start,
    after: total - end,
  };
}
