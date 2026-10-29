import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { format } from 'date-fns/format';
import { formatRelative } from 'date-fns/formatRelative';
import { toDateFnsLocale } from '../toDateFnsLocale.ts';
import { isInRelativeRange } from './isInRelativeRange.ts';

type ToRelativeOrFormattedDateProps = {
  today: Date;
  date: Date;
  localeKey: AvailableLocale;
  pattern: string;
};

export function toRelativeOrFormattedDate({
  today,
  date,
  localeKey,
  pattern,
}: ToRelativeOrFormattedDateProps): string {
  const locale = toDateFnsLocale(localeKey);

  if (isInRelativeRange(today, date)) {
    return formatRelative(date, today, { locale });
  }

  return format(date, pattern, { locale });
}
