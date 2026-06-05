import type { Snippet } from 'svelte';

export type StatsCardStats = {
  movieCount: number;
  showCount: number;
  episodeCount: number;
};

export type StatsCardProps = {
  title: string;
  stats: StatsCardStats;
  isLoading: boolean;
  footer: Snippet;
};
