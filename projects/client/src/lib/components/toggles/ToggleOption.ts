import type { Snippet } from 'svelte';

type IntlFn = () => string;

export interface ToggleOption<T> {
  value: T;
  text: IntlFn;
  label: IntlFn;
  content?: Snippet;
  /**
   * Optional icon override. When provided, it renders instead of the
   * value-based icon lookup - the preferred way to supply icons for toggle
   * values the shared map doesn't know about.
   */
  icon?: Snippet;
  href?: string;
}
