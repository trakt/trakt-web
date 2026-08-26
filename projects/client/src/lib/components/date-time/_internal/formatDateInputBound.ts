import { getEndOfDay } from '$lib/utils/date/getEndOfDay.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import type { DateInputType } from './DateInputProps.ts';
import { formatDateInputValue } from './formatDateInputValue.ts';

type FormatDateInputBoundParams = {
  date: Date | undefined;
  type: DateInputType;
  edge: 'min' | 'max';
};

export function formatDateInputBound(
  { date, type, edge }: FormatDateInputBoundParams,
): string | undefined {
  if (!date) return undefined;
  if (type === 'date') return formatDateInputValue(date, type);

  return formatDateInputValue(
    edge === 'min' ? getStartOfDay(date) : getEndOfDay(date),
    type,
  );
}
