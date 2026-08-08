import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { toGroupedNumber } from '$lib/utils/formatting/number/toGroupedNumber.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

/*
  Below this, some locales' compact notation (e.g. "4,2 тыс.", "1 लाख") is
  actually wider than the plain grouped number, so abbreviating buys nothing.
  User-driven counts (plays, episodes watched, ratings, ...) realistically
  never exceed this, so this keeps counts legible by default and only
  abbreviates the rare outlier that does.
*/
const COMPACT_THRESHOLD = 100_000;

export function toHumanCount(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
): string {
  return Math.abs(value) < COMPACT_THRESHOLD
    ? toGroupedNumber(value, locale)
    : toHumanNumber(value, locale);
}
