import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { BehaviorSubject } from 'rxjs';
import type { ActiveComment } from '../models/ActiveComment.ts';

export function useActiveComment(source?: ActiveComment) {
  const activeComment = new BehaviorSubject<ActiveComment | undefined>(source);

  const reset = () => {
    activeComment.next(undefined);
  };

  const setReplying = (comment: MediaComment, isReplying: boolean) => {
    activeComment.next({ id: comment.id, isReplying });
  };

  return {
    activeComment: activeComment.asObservable(),
    setReplying,
    reset,
  };
}
