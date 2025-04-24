import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export type TraktActionButtonProps = ButtonProps & {
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default';
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'small';
  style?: 'flat' | 'ghost';
  navigationType?: DpadNavigationType;
};
