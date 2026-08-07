/**
 * One award or nomination for a title.
 *
 * There is no awards endpoint yet, so this shape is the contract the mock is
 * written against rather than something derived from an API response. It is kept
 * deliberately small - body, category, year, and whether it was won - because
 * those are the four things the header has room to show. Anything richer belongs
 * in the drawer this will eventually open.
 */
export type MediaAward = {
  key: string;
  /** The awarding body, e.g. "Emmy". */
  body: string;
  /** What it was for, e.g. "Outstanding Drama Series". */
  category: string;
  year: number;
  /** `false` means nominated but did not win. */
  isWinner: boolean;
};
