import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toUnitFormatter } from '$lib/utils/formatting/number/toUnitFormatter.ts';

export function toScreenTimeDuration(
  minutes: number,
  language: AvailableLanguage,
): string {
  const duration = toHumanDuration({ minutes }, language);

  if (duration) {
    return duration;
  }

  return toUnitFormatter({
    locale: getIntlLocale(language),
    unit: 'minute',
    suffix: 'm',
    options: { unitDisplay: 'narrow' },
  })(0);
}
