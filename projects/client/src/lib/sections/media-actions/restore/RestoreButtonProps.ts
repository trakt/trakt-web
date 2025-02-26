export type RestoreButtonProps = {
  title: string;
  isRestoring: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onRestore: () => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
