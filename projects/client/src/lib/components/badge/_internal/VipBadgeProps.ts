import type { VipBadgeTone } from '../VipBadgeTone.ts';

export type VipBadgeProps = {
  isDirector?: boolean;
  size?: 'normal' | 'large';
  tone?: VipBadgeTone;
  label?: string;
};
