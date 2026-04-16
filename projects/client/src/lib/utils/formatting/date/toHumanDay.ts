import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { format } from 'date-fns/format';

const FORMAT_STRINGS = {
  short: 'PP',
  long: 'PPP',
  'long-with-time': 'PPP p',
} as const;

type ToHumanDayProps = {
  date: Date;
  locale: AvailableLocale;
  format?: keyof typeof FORMAT_STRINGS;
};

export function toHumanDay(
  { date, locale: localeKey, format: formatOption = 'long' }: ToHumanDayProps,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];
  const formatString = FORMAT_STRINGS[formatOption];

  return format(date, formatString, {
    locale,
  });
}
