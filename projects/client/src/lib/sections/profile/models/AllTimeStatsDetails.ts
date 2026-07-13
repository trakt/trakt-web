export type AllTimeStatsDetails = {
  playCount: number;
  minuteCount: number;
  movieCount: number;
  showCount: number;
  episodeCount: number;
  commentCount: number;
  ratingCount: number;
  listCount: number;
  droppedCount: number;
  /** VIP-only. `null` when the current user is not a VIP. */
  startedCount: number | null;
  /** VIP-only. `null` when the current user is not a VIP. */
  finishedCount: number | null;
};
