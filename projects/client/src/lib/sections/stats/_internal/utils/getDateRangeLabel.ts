import { getLocale } from '$lib/features/i18n/index.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import type { DateRange } from '../models/DateRange.ts';

export function getDateRangeLabel(range: DateRange) {
  const locale = getLocale();
  return `${toHumanDay(range.start, locale, 'short')} - ${
    toHumanDay(range.end, locale, 'short')
  }`;
}
