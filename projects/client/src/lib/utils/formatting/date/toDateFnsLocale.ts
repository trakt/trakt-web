import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import type { Locale } from 'date-fns/locale';
import { LOCALE_MAP } from './LOCALE_MAP.ts';

export function toDateFnsLocale(localeKey: AvailableLocale): Locale {
  return LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];
}
