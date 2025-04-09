import type { Snippet } from 'svelte';

export type ListDropdownButtonProps = {
  title: string;
  items: Snippet;
  isListed: boolean;
  style?: 'normal' | 'action';
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
