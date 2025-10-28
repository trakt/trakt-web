import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type DropButtonProps = {
  title: string;
  isDropping: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onDrop: () => void;
  type: MediaType;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'type'>;
