export type RottenTomatoRating = 'rotten' | 'fresh' | 'unrated';
export type RottenTomatoAudienceRating = 'hot' | 'stale' | 'unrated';

export function toRottenCriticRating(
  rating?: number | Nil,
): RottenTomatoRating {
  if (!rating) {
    return 'unrated';
  }

  if (rating < 60) {
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

  if (rating < 60) {
    return 'stale';
  }

  return 'hot';
}
