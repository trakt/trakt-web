import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export type TraktActionButtonProps = ButtonProps & {
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default';
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'small' | 'large';
  style?: 'flat' | 'ghost';
  navigationType?: DpadNavigationType;
  classList?: string;
  /**
   * Whether the icon-only button shows its `label` as a hover tooltip
   * (pointer devices only). Defaults to `true`. Set `false` when the caller
   * wraps the button in its own tooltip with bespoke copy or placement.
   */
  tooltip?: boolean;
};
