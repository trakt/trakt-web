import { differenceInYears } from 'date-fns/differenceInYears';

export function getYearsDifference(dateA: Date, dateB: Date): number {
  return Math.abs(differenceInYears(dateA, dateB));
}
