export type MonthToDateDetails = {
  playCount: number;
  movieCount: number;
  showCount: number;
  episodeCount: number;
  minuteCount: number;
  /** Only populated for the current user - sourced from their own ratings. */
  ratingCount?: number;
  coverUrl: HttpsUrl;
};
