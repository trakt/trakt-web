import type { Snippet } from 'svelte';

export type GameButtonProps = {
  children: Snippet;
  onclick: () => void;
  variant?: 'primary' | 'glass';
  shape?: 'pill' | 'round';
  label?: string;
  isAutofocused?: boolean;
};
