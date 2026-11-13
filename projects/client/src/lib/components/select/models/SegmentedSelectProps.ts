import type { Snippet } from 'svelte';
import type { SegmentedSelectOption } from './SegmentedSelectOption.ts';
import type { SelectStyle } from './SelectStyle.ts';
import type { SelectVariant } from './SelectVariant.ts';

export type SegmentedSelectProps<TValue extends string = string> = {
  options: ReadonlyArray<SegmentedSelectOption<TValue>>;
  value: TValue;
  variant?: SelectVariant;
  style?: SelectStyle;
  disabled?: boolean;
  fill?: boolean;
  ariaLabel?: string;
  icon?: Snippet<[SegmentedSelectOption<TValue>]>;
  expandable?: boolean;
  collapsedCount?: number;
  expanded?: boolean;
  extension?: Snippet;
  /** Content that opens inside the track before the segments (expandable only). */
  leading?: Snippet;
  isLeadingOpen?: boolean;
  onChange: (value: TValue) => void;
};
