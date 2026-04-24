import type { DatePickerProps } from '../../date-time/models/DatePickerProps.ts';
import type { ValidationProps } from './ValidationProps.ts';

export type FormDatePickerProps = {
  validation?: ValidationProps<Date | undefined>;
} & DatePickerProps;
