export type MoreButtonIntl = {
  more: (count: number | Nil) => string;
  /**
   * The collapsed-again label. Its own string rather than "more" with a minus in
   * front - "- more" reads as nonsense, and no language forms its opposite that way.
   */
  less: () => string;
};
