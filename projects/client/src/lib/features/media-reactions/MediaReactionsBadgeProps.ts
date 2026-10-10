import type { MediaReactionsTarget } from './MediaReactionsTarget.ts';

export type MediaReactionsBadgeProps = MediaReactionsTarget & {
  variant?: 'default' | 'compact';
  onReact?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
};
