import { STAR_RATINGS } from '../../../sections/summary/components/rating/constants/index.ts';
import { toHumanNumber } from './toHumanNumber.ts';

const MAX_RATING = 10;

export function toUserRating(rating: number, locale = 'en') {
  const factor = MAX_RATING / STAR_RATINGS.length;

  const starRating = rating / factor;

  return toHumanNumber(starRating, locale);
}
