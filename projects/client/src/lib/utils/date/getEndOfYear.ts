import { endOfYear } from 'date-fns/endOfYear';

export function getEndOfYear(date: Date): Date {
  return endOfYear(date);
}
