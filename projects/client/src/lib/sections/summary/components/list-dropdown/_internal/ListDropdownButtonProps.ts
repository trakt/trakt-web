import type { Snippet } from 'svelte';

export type ListDropdownButtonProps = {
  title: string;
  items: Snippet;
  isListed: boolean;
  size?: 'small' | 'normal';
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
