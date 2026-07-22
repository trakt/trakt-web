import type { SelectOption } from './SelectOption.ts';

export type SegmentedSelectOption<TValue extends string = string> =
  & Omit<SelectOption, 'value'>
  & {
    value: TValue;
    href?: string;
  };
