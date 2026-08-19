import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

export function toScreenTimeDuration(
  minutes: number,
  language: AvailableLanguage,
): string {
  const duration = toHumanDuration({ minutes }, language);

  if (duration) {
    return duration;
  }

  return new Intl.NumberFormat(getIntlLocale(language), {
    style: 'unit',
    unit: 'minute',
    unitDisplay: 'narrow',
  }).format(0);
}
