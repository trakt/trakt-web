import type { EpisodeResponse, MovieResponse } from '@trakt/api';
import type { PostCredits } from '../models/PostCreditsSchema.ts';

export function mapToPostCredits(
  response: EpisodeResponse | MovieResponse | Nil,
): PostCredits[] {
  const postCredits: PostCredits[] = [];

  if (!response) {
    return postCredits;
  }

  response.during_credits && postCredits.push('during');
  response.after_credits && postCredits.push('after');

  return postCredits;
}
