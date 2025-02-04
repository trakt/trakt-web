import { SimpleRating } from '$lib/models/SimpleRating.ts';

type SimpleRatingMap = {
  [key in SimpleRating]: number;
};

export const SIMPLE_RATINGS: SimpleRatingMap = {
  [SimpleRating.Bad]: 3,
  [SimpleRating.Good]: 7,
  [SimpleRating.Great]: 10,
} as const;
