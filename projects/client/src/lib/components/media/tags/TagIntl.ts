export type TagIntl = {
  toDuration: (duration: number) => string;
  toEpisodeCount: (count: number) => string;
  toPlayCount: (count: number) => string;
  toWatcherCount: (count: number) => string;
  toReleaseEstimate: (airDate: Date) => string;
  toActivityDate: (activityDate: Date) => string;
  tbaLabel: () => string;
  toAnticipatedCount: (count: number) => string;
  watchCountLabel: () => string;
  trendLabel: (delta: number) => string;
  postCredits: (count: number) => string;
  toDay: (date: Date) => string;
  watchedLabel: () => string;
  toRemainingDuration: (duration: number) => string;
};
