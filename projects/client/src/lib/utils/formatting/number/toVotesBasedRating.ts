export type VotesBasedRating = 'unrated' | 'rated';

export function toVotesBasedRating(votes?: number): VotesBasedRating {
  if (!votes) {
    return 'unrated';
  }

  return 'rated';
}
