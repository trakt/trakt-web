import type { Snippet } from 'svelte';
import type { SegmentedSelectOption } from './SegmentedSelectOption.ts';
import type { SelectVariant } from './SelectVariant.ts';

export type SegmentedSelectProps<TValue extends string = string> = {
  options: ReadonlyArray<SegmentedSelectOption<TValue>>;
  value: TValue;
  variant?: SelectVariant;
  disabled?: boolean;
  ariaLabel?: string;
  icon?: Snippet<[SegmentedSelectOption<TValue>]>;
  expandable?: boolean;
  collapsedCount?: number;
  expanded?: boolean;
  extension?: Snippet;
  onChange: (value: TValue) => void;
};
