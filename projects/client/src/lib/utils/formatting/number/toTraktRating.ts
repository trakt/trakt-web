import { toPercentage } from './toPercentage.ts';

export function toTraktRating(rating: number, locale = 'en') {
  return toPercentage(rating, locale);
}
