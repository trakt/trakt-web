export type SeasonWatchState = {
  number: number;
  watched: number;
  aired: number;
  total: number;
  progress: number;
  isComplete: boolean;
  watchedEpisodeIds: ReadonlySet<number>;
};
