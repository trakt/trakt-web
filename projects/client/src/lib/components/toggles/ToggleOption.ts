import type { Snippet } from 'svelte';

type IntlFn = () => string;

export interface ToggleOption<T> {
  value: T;
  text: IntlFn;
  label: IntlFn;
  content?: Snippet;
}
