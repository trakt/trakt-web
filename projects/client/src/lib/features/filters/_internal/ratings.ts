import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { SIMPLE_RATINGS } from '$lib/sections/summary/components/rating/constants.ts';

type RatingsValueMap = {
  [key in SimpleRating]: string;
};

function getRatingRange(
  range: { min?: SimpleRating; max?: SimpleRating },
): string {
  const min = range.min ? SIMPLE_RATINGS[range.min] * 10 : 0;
  const max = range.max ? SIMPLE_RATINGS[range.max] * 10 - 1 : 100;
  return `${min}-${max}`;
}

export const RATINGS: RatingsValueMap = {
  [SimpleRating.Bad]: getRatingRange({ max: SimpleRating.Good }),
  [SimpleRating.Good]: getRatingRange({
    min: SimpleRating.Good,
    max: SimpleRating.Great,
  }),
  [SimpleRating.Great]: getRatingRange({ min: SimpleRating.Great }),
} as const;
