import type { UseCheckInProps } from './useCheckIn.ts';

export type CheckInActionProps = {
  style: 'normal' | 'action' | 'dropdown-item';
  title: string;
  size?: 'normal' | 'small';
  variant?: 'primary' | 'secondary';
} & UseCheckInProps;
