import { addDays as dateAdd } from 'date-fns/addDays';

export function addDays(date: Date, days: number): Date {
  return dateAdd(date, days);
}
