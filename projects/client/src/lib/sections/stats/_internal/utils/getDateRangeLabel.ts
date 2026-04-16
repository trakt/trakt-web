import { getLocale } from '$lib/features/i18n/index.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import type { DateRange } from '../models/DateRange.ts';

export function getDateRangeLabel(range: DateRange) {
  const locale = getLocale();
  return `${toHumanDay({ date: range.start, locale, format: 'short' })} - ${
    toHumanDay({ date: range.end, locale, format: 'short' })
  }`;
}
