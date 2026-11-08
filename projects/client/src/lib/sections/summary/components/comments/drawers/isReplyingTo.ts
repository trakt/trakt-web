import type { ActiveComment } from '../_internal/models/ActiveComment.ts';

export function isReplyingTo(
  activeComment: ActiveComment | undefined,
  id: number,
) {
  return activeComment?.id === id && activeComment?.isReplying;
}
