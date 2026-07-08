import type { Snippet } from 'svelte';

export type StatsCardStats = {
  playCount: number;
  movieCount: number;
  showCount: number;
  episodeCount: number;
  minuteCount?: number;
  ratingCount?: number;
  commentCount?: number;
};

export type StatsCardProps = {
  title: string;
  stats: StatsCardStats;
  isLoading: boolean;
  footer: Snippet;
};
