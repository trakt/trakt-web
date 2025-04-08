import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import type { Sentiments } from '$lib/requests/models/Sentiments.ts';
import type { Comment } from './models/Comment.ts';

export function mergeComments(
  comments: MediaComment[],
  sentiments?: Sentiments,
): Array<Comment> {
  const typedComments = comments.map((comment) => ({
    type: 'comment' as const,
    ...comment,
  }));

  if (!sentiments) {
    return typedComments;
  }

  const typedSentiments = {
    type: 'sentiments' as const,
    id: -1,
    ...sentiments,
  };

  return [typedSentiments, ...typedComments];
}
