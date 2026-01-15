import { STAR_RATINGS } from '../../../sections/summary/components/rating/constants/index.ts';
import { toHumanNumber } from './toHumanNumber.ts';

const MAX_RATING = 10;

export function toTraktRating(rating: number, locale = 'en') {
  const factor = MAX_RATING / STAR_RATINGS.length;

  const starRating = rating * 10 / factor;

  return toHumanNumber(starRating, locale);
}
