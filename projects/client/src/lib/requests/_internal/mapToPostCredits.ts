import type { PostCredits } from '../models/PostCreditsSchema.ts';

export function mapToPostCredits(
  response:
    | { during_credits?: boolean | null; after_credits?: boolean | null }
    | Nil,
): PostCredits[] {
  const postCredits: PostCredits[] = [];

  if (!response) {
    return postCredits;
  }

  response.during_credits && postCredits.push('during');
  response.after_credits && postCredits.push('after');

  return postCredits;
}
