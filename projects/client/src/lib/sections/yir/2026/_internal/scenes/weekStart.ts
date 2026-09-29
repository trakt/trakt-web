import { addDays } from 'date-fns/addDays';
import { startOfYear } from 'date-fns/startOfYear';

export function weekStart(year: number, week: number): Date {
  return addDays(startOfYear(new Date(year, 0, 1)), week * 7);
}
