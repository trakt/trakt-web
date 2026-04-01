import type { Snippet } from 'svelte';

export type TooltipProps = {
  content: string | Snippet;
  variant?: 'default' | 'compact';
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  sideOffset?: number;
  disabled?: boolean;
};
