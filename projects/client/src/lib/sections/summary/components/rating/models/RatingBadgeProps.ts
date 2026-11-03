import type { RateNowProps } from './RateNowProps.ts';

export type RatingBadgeProps = {
  target: RateNowProps;
  /**
   * `guard` locks the mark - and the heart with it - until the title has
   * been watched: rating is an opinion about something seen. Locked, not
   * hidden, so the reader can see the two answers exist and what unlocks
   * them; the tooltip says so.
   */
  variant?: 'allow' | 'guard';
  /**
   * Seats the heart beside the mark instead of inside the popover, for a
   * surface with room to show both answers at once.
   */
  favorite?: boolean;
  /**
   * `chip` marks the score as the viewer's own beside community scores: a
   * tinted chip when rated, an outlined star with a dot inviting a rating
   * once watched, a quiet outlined star before that.
   */
  look?: 'mark' | 'chip';
};
