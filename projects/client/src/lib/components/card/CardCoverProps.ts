import type { Snippet } from 'svelte';

export type CardCoverProps = {
  src: string;
  alt: string;
  title: string;
  badges?: Snippet;
  tags?: Snippet;
  isLoading?: boolean;
  style?: 'flat' | 'gradient';
};
