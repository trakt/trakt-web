import { subDays } from 'date-fns/subDays';

export function subtractDays(date: Date, days: number): Date {
  return subDays(date, days);
}
