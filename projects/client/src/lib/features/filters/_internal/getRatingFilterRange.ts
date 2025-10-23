import type { StarRating } from '$lib/sections/summary/components/rating/models/StarRating.ts';

const FILTER_VALUE_FACTOR = 10;

export function getRatingFilterRange(starRating: StarRating): string {
  const { range, index } = starRating;

  const min = index === 1 ? 0 : range.min * FILTER_VALUE_FACTOR + 1;
  const max = range.max * FILTER_VALUE_FACTOR;

  return `${min}-${max}`;
}
