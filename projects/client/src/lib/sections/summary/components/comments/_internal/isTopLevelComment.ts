import type { MediaComment } from '$lib/requests/models/MediaComment.ts';

// The API reports a top-level comment's parent as 0.
export function isTopLevelComment(comment: Pick<MediaComment, 'parentId'>) {
  return comment.parentId === 0;
}
