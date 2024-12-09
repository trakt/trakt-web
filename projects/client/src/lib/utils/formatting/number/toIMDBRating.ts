export type IMDBRating = 'unrated' | 'rated';

export function toIMDBRating(votes: number): IMDBRating {
  if (votes === 0) {
    return 'unrated';
  }

  return 'rated';
}
