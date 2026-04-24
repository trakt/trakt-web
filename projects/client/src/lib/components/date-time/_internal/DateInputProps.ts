import type { DatePickerProps } from './DatePickerProps.ts';

export type DateInputType = 'date' | 'datetime-local';

export type DateInputProps = {
  type: DateInputType;
} & DatePickerProps;
