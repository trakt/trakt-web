import { languageTag } from '$lib/features/i18n/index.ts';
import { toPercentage } from './toPercentage.ts';

export type RottenTomatoRating = 'rotten' | 'fresh' | 'unrated';
export type RottenTomatoAudienceRating = 'hot' | 'stale' | 'unrated';

export function toRottenCriticRating(
  rating?: number | Nil,
): RottenTomatoRating {
  if (!rating) {
    return 'unrated';
  }

  if (rating < 0.6) {
    return 'rotten';
  }

  return 'fresh';
}

export function toRottenAudienceRating(
  rating?: number | Nil,
): RottenTomatoAudienceRating {
  if (!rating) {
    return 'unrated';
  }

  if (rating < 0.6) {
    return 'stale';
  }

  return 'hot';
}

export function toRottenPercentage(rating?: number | Nil) {
  if (!rating) {
    return;
  }

  return toPercentage(rating, languageTag());
}
