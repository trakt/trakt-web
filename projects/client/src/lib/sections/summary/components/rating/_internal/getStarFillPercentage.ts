import { STAR_RATINGS } from '../constants/index.ts';
import type { StarRating } from '../models/StarRating.ts';

export function getStarFillPercentage(
  star: StarRating,
  rating?: number,
): number {
  if (!rating) {
    return 0;
  }

  const step = 10 / STAR_RATINGS.length;
  const roundedRating = Math.round(rating / step) * step;
  const value = star.index * step;

  return value <= roundedRating ? 100 : 0;
}
