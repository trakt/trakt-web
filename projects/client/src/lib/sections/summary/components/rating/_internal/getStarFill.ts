import type { StarRating } from '../models/StarRating.ts';

type StarFill = 'none' | 'half' | 'full';

export function getStarFill(
  star: StarRating,
  rating?: number,
): StarFill {
  if (!rating) {
    return 'none';
  }

  const { min, max } = star.range;

  if (rating >= max) {
    return 'full';
  }
  if (rating <= min) {
    return 'none';
  }

  return 'half';
}
