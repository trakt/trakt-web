import type { Snippet } from 'svelte';

export interface ToggleOption {
  value: string;
  label: string;
  content?: Snippet;
}
