import type { Snippet } from 'svelte';

export interface ToggleOption<T> {
  value: T;
  text: string;
  label: string;
  content?: Snippet;
}
