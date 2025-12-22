import { isWithinInterval } from 'date-fns/isWithinInterval';

export function isInDateRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end });
}
