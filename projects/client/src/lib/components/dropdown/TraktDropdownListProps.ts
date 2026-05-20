import type { Snippet } from 'svelte';

export type TraktDropdownListProps = {
  label: string;
  disabled?: boolean;
  icon?: Snippet;
  items: Snippet;
} & ChildrenProps;
