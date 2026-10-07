import { differenceInMonths } from 'date-fns/differenceInMonths';

export function getMonthsDifference(dateA: Date, dateB: Date): number {
  return Math.abs(differenceInMonths(dateA, dateB));
}
