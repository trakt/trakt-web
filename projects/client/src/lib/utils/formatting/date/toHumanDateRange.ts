import {
  type AvailableLocale,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';

type ToHumanDateRangeParams = {
  start: Date;
  end: Date;
  locale: AvailableLocale;
};

export function toHumanDateRange(
  { start, end, locale }: ToHumanDateRangeParams,
): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: 'numeric',
    month: 'long',
  }).formatRange(start, end);
}
