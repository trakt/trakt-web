import type { Snippet } from 'svelte';

export type CardCoverProps = {
  src: string;
  alt: string;
  tags?: Snippet;
  isLoading?: boolean;
  style?: 'flat' | 'gradient';
};
