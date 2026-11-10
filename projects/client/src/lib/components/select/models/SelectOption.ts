import type { Snippet } from 'svelte';
import type { SelectOptionGroup } from './SelectOptionGroup.ts';

export type SelectOption = {
  label: string;
  value: string;
  /* Multi-select only: when false the option cannot be excluded (no toggle). */
  excludable?: boolean;
  group?: SelectOptionGroup;
  keywords?: ReadonlyArray<string>;
  icon?: Snippet<[SelectOption]>;
  tag?: Snippet<[SelectOption]>;
};
