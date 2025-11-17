import type { CheckInButtonIntl } from './CheckInButtonIntl.ts';

export type CheckInButtonProps = {
  i18n?: CheckInButtonIntl;
  title: string;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  isCheckingIn: boolean;
  isCheckedIn: boolean;
  variant?: 'primary' | 'secondary';
  checkin: () => Promise<void>;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
