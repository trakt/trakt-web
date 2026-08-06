import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { toGroupedNumber } from './toGroupedNumber.ts';
import { toHumanNumber } from './toHumanNumber.ts';

const compactThreshold = 100_000;

export function toHumanCount(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
): string {
  return Math.abs(value) < compactThreshold
    ? toGroupedNumber(value, locale)
    : toHumanNumber(value, locale);
}
