import type { Snippet } from 'svelte';

export type TodayTileProps = {
  label: string;
  onOpen: () => void;
  children: Snippet;
};
