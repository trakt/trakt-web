import type { Snippet } from 'svelte';

export type AppRowProps = {
  icon: Snippet;
  title: string;
  href?: string;
  children?: Snippet;
};
