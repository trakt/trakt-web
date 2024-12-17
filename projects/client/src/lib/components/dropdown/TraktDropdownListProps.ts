import type { TraktButtonProps } from '$lib/components/buttons/TraktButtonProps.ts';
import type { Snippet } from 'svelte';

export type TraktDropdownListProps = {
  items: Snippet;
  style?: Exclude<TraktButtonProps['style'], 'ghost'>;
  variant?: Exclude<TraktButtonProps['variant'], 'secondary' | 'custom'>;
} & Omit<TraktButtonProps, 'style'>;
