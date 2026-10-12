import { dateKey } from '../../_internal/dateKey.ts';

export function scrollToCalendarDay(date: Date) {
  const element = document.getElementById(dateKey(date));
  element?.scrollIntoView({ block: 'start', behavior: 'smooth' });

  return element !== null;
}
