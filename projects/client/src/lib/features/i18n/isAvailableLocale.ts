import {
  type AvailableLocale,
  availableLocales,
} from '$lib/features/i18n/index.ts';

/**
 * Narrows an arbitrary string to a known locale. Guards the boundary where a
 * persisted/cookie value (which may reference a removed or unknown locale) is
 * compared against the app's available locales.
 */
export function isAvailableLocale(value: string): value is AvailableLocale {
  return (availableLocales as readonly string[]).includes(value);
}
