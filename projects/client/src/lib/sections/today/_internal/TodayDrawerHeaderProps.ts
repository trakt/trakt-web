import type { Snippet } from 'svelte';

export type TodayDrawerHeaderProps = {
  href: string;
  cover: string;
  title: string;
  meta: string;
  lead: Snippet;
  badges?: Snippet;
};
