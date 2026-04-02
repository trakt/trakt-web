import { startOfDay } from 'date-fns/startOfDay';

export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}
