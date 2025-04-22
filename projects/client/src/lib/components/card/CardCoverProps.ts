import type { Snippet } from 'svelte';

export type CardCoverProps = {
  src: string;
  alt: string;
  title: string;
  badge?: Snippet;
  tag?: Snippet;
  isLoading?: boolean;
  style?: 'flat' | 'gradient';
};
