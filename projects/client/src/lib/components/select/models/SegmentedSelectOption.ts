import type { SelectOption } from './SelectOption.ts';

export type SegmentedSelectOption<TValue extends string = string> = Omit<
  SelectOption,
  'value' | 'label'
> & {
  value: TValue;
  text: string;
  label?: string;
  href?: string;
  count?: number;
  /** Folds the segment away (width 0, inert) while keeping its place. */
  isFolded?: boolean;
};
