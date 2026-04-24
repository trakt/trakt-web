import type { DatePickerProps } from '../models/DatePickerProps.ts';

export type DateInputType = 'date' | 'datetime-local';

export type DateInputProps = {
  type: DateInputType;
} & DatePickerProps;
