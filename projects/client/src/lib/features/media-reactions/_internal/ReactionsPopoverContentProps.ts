import type { ReactionsPopoverProps } from './ReactionsPopoverProps.ts';

export type ReactionsPopoverContentProps =
  & Omit<ReactionsPopoverProps, 'trigger'>
  & { onMore?: () => void };
