import { TagIntlProvider } from '$lib/components/media/tags/TagIntlProvider.ts';
import type { TagIntl } from '$lib/components/media/tags/TagIntl.ts';
import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA.ts';

function toCalendarReleaseEstimate(airDate: Date): string {
  const now = new Date();
  const airedEarlierToday = airDate.getTime() < now.getTime() &&
    airDate.getTime() >= getStartOfDay(now).getTime();

  if (airedEarlierToday) {
    return new Intl.RelativeTimeFormat(getLocale(), { numeric: 'auto' })
      .format(0, 'day');
  }

  return toHumanETA(now, airDate, getLocale());
}

export const CalendarTagIntlProvider: TagIntl = {
  ...TagIntlProvider,
  toReleaseEstimate: toCalendarReleaseEstimate,
};
