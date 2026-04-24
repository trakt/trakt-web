import { formatLocalDate } from '../../../utils/date/formatLocalDate.ts';
import { formatLocalDateTime } from '../../../utils/date/formatLocalDateTime.ts';
import type { DateInputType } from './DateInputProps.ts';

export function formatDateInputValue(
  date: Date | undefined,
  type: DateInputType,
) {
  if (!date) return undefined;
  return type === 'date' ? formatLocalDate(date) : formatLocalDateTime(date);
}
