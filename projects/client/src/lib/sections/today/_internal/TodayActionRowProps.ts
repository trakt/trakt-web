import type { Snippet } from 'svelte';

export type TodayActionRowProps = {
  lead: Snippet;
  title: string;
  detail: string;
  rating: number | Nil;
};
