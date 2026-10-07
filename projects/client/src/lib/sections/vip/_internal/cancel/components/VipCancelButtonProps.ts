import type { Snippet } from 'svelte';

export type VipCancelButtonProps = {
  look: 'primary' | 'secondary';
  label: string;
  onclick?: () => void;
  href?: string;
  target?: '_blank';
  disabled?: boolean;
  children: Snippet;
};
