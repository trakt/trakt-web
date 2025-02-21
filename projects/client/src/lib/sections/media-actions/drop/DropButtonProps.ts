export type DropButtonProps = {
  title: string;
  isDropping: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onDrop: () => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
