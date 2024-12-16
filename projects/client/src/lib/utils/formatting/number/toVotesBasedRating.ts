export type VotesBasedRating = 'unrated' | 'rated';

export function toVotesBasedRating(votes: number): VotesBasedRating {
  if (votes === 0) {
    return 'unrated';
  }

  return 'rated';
}
