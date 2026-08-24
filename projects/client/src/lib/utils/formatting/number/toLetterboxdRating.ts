import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { toGroupedNumber } from './toGroupedNumber.ts';
import { toIMDBRating } from './toIMDBRating.ts';

const LETTERBOXD_MAX_RATING = 5;

/**
 * Letterboxd scores run 0-5, while IMDB runs 0-10.
 * A bare "4.1" next to an "8.2" reads as the worse film.
 */
export function toLetterboxdRating(
  rating: number,
  locale: AvailableLocale | AvailableLanguage | string,
): string {
  const value = toIMDBRating(rating, locale);
  const max = toGroupedNumber(LETTERBOXD_MAX_RATING, locale);

  return `${value}/${max}`;
}
