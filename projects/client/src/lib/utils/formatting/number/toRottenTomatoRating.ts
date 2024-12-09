export type RottenTomatoRating = 'rotten' | 'fresh' | 'unrated';

export function toRottenTomatoRating(
  rating: number,
): 'rotten' | 'fresh' | 'unrated' {
  if (rating === 0) {
    return 'unrated';
  }

  if (rating < 60) {
    return 'rotten';
  }

  return 'fresh';
}
