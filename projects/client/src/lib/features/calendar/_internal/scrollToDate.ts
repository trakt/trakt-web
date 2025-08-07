import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isSameDay } from 'date-fns/isSameDay';
import type { ActiveDate } from '../context/ActiveDate.ts';
import { dateKey } from './dateKey.ts';

export function scrollToDate(activeDate: ActiveDate, offset: number) {
  const { date, source } = activeDate;

  if (source === 'scroll') {
    return;
  }

  if (isSameDay(date, getStartOfWeek(date, getLocale()))) {
    globalThis.window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  const key = dateKey(date);
  const element = document.getElementById(key);
  if (!element) {
    return;
  }

  // FIXME: on initial load this top is not correct
  const top = element.getBoundingClientRect().top;
  const y = top + globalThis.window.scrollY - offset;
  globalThis.window.scrollTo({ top: y, behavior: 'smooth' });
}
