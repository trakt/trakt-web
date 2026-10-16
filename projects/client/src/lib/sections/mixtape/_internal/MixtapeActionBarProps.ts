import type { Snippet } from 'svelte';

export type MixtapeActionBarProps = {
  children: Snippet;
  pickCount: number;
  clearHref: string;
  mixHref: string;
  onMix: () => void;
};
