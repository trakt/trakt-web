import type { Snippet } from 'svelte';

export type StatsCardStats = {
  playCount: number;
  movieCount: number;
  showCount: number;
  episodeCount: number;
  /** Optional extras - rendered only in the large card layout when present. */
  minuteCount?: number;
  ratingCount?: number;
  listCount?: number;
  commentCount?: number;
};

export type StatsCardProps = {
  title: string;
  stats: StatsCardStats;
  isLoading: boolean;
  footer: Snippet;
};
