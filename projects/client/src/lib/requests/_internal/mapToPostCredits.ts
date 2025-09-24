import type { EpisodeResponse, MovieResponse } from '@trakt/api';
import type { PostCredits } from '../models/PostCreditsSchema.ts';

export function mapToPostCredits(
  response: EpisodeResponse | MovieResponse,
): PostCredits[] {
  const postCredits: PostCredits[] = [];

  response.during_credits && postCredits.push('during');
  response.after_credits && postCredits.push('after');

  return postCredits;
}
