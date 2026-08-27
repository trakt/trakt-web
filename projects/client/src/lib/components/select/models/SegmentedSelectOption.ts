import type { SelectOption } from './SelectOption.ts';

export type SegmentedSelectOption<TValue extends string = string> =
  & Omit<SelectOption, 'value' | 'label'>
  & {
    value: TValue;
    text: string;
    label?: string;
    href?: string;
  };
