import { SimpleRating } from '$lib/models/SimpleRating';
import { SIMPLE_RATINGS } from './constants';

export function mapRatingToSimpleRating(value: number): SimpleRating {
  if (value === SIMPLE_RATINGS[SimpleRating.Great]) {
    return SimpleRating.Great;
  }

  if (value >= SIMPLE_RATINGS[SimpleRating.Good]) {
    return SimpleRating.Good;
  }

  return SimpleRating.Bad;
}
