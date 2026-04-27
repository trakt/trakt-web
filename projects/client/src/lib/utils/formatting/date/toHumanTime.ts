import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { format } from 'date-fns/format';

type ToHumanTimeProps = {
  date: Date;
  locale: AvailableLocale;
};

export function toHumanTime(
  { date, locale }: ToHumanTimeProps,
): string {
  return format(date, 'p', { locale: LOCALE_MAP[locale] });
}
