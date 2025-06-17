import type { Snippet } from 'svelte';

export type CardCoverProps = {
  src: string;
  overlaySrc?: string;
  alt: string;
  title: string;
  badge?: Snippet;
  tag?: Snippet;
  style?: 'flat' | 'gradient';
};
