import { endOfDay } from 'date-fns/endOfDay';

export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}
