import type { RatingDelight } from '../models/RatingDelight.ts';

const MAX_RATING = 10;
const LOWEST_RATINGS_CEILING = 2;

export function ratingDelight(rating: number): RatingDelight['kind'] | null {
  if (rating === MAX_RATING) return 'popcorn';
  if (rating > 0 && rating <= LOWEST_RATINGS_CEILING) return 'rotten-tomato';
  return null;
}
