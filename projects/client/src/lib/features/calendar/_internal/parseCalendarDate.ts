import { parseLocalDate } from '$lib/utils/date/parseLocalDate.ts';
import { isValid } from 'date-fns/isValid';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseCalendarDate(value: string | null): Date | null {
  if (!value || !DATE_PATTERN.test(value)) return null;

  const date = parseLocalDate(value);
  return isValid(date) ? date : null;
}
