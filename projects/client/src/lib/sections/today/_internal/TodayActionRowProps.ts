import type { Snippet } from 'svelte';

export type TodayActionRowProps = {
  lead: Snippet;
  title: string;
  action: string;
  time: string;
  rating: number | Nil;
  children?: Snippet;
};
