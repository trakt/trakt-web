import type { StarRating } from '../models/StarRating.ts';

export const STAR_RATINGS: StarRating[] = [
  { index: 1, value: 2, range: { min: 0, max: 2 } },
  { index: 2, value: 4, range: { min: 2, max: 4 } },
  { index: 3, value: 6, range: { min: 4, max: 6 } },
  { index: 4, value: 8, range: { min: 6, max: 8 } },
  { index: 5, value: 10, range: { min: 8, max: 10 } },
] as const;
