import { differenceInDays } from 'date-fns/differenceInDays';

export function getDaysDifference(dateA: Date, dateB: Date): number {
  return Math.abs(differenceInDays(dateA, dateB));
}
