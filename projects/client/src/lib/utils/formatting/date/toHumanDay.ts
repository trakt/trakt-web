import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { format } from 'date-fns/format';

const FORMAT_STRINGS = {
  short: 'PP',
  long: 'PPP',
  'long-with-time': 'PPP p',
} as const;

export function toHumanDay(
  date: Date,
  localeKey: AvailableLocale,
  formatOption: keyof typeof FORMAT_STRINGS = 'long',
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];
  const formatString = FORMAT_STRINGS[formatOption];

  return format(date, formatString, {
    locale,
  });
}
