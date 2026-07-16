import type { Snippet } from 'svelte';

export type TooltipProps = {
  content: string | Snippet;
  variant?: 'default' | 'compact';
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  sideOffset?: number;
  disabled?: boolean;
  /*
    Let the pointer pass straight through the tooltip content instead of the
    content staying hoverable. Needed when the tooltip renders over another
    hover target (e.g. an adjacent cell in a grid), where hoverable content
    would swallow the pointer and keep showing stale data. Forwarded to
    bits-ui, which sets pointer-events: none on the content.
  */
  disableHoverableContent?: boolean;
};
