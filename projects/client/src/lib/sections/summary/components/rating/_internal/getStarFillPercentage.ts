import type { StarRating } from '../models/StarRating.ts';

export function getStarFillPercentage(
  star: StarRating,
  rating?: number,
): number {
  if (!rating) {
    return 0;
  }

  const { min, max } = star.range;

  if (rating >= max) {
    return 100;
  }
  if (rating <= min) {
    return 0;
  }

  return ((rating - min) / (max - min)) * 100;
}
