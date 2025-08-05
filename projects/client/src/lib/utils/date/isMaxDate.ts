import { MAX_DATE } from '../constants.ts';

export function isMaxDate(date: Date | Nil): boolean {
  if (!date) {
    return false;
  }

  return date.getTime() === MAX_DATE.getTime();
}
