import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import type { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { BehaviorSubject } from 'rxjs';
import type { ActiveComment } from '../_internal/models/ActiveComment.ts';

type UseActiveCommentProps = {
  source?: ActiveComment;
  confirm: ReturnType<typeof useConfirm>['confirm'];
};

const noDraft = () => false;

export function useActiveComment({ source, confirm }: UseActiveCommentProps) {
  const activeComment = new BehaviorSubject<ActiveComment | undefined>(source);
  const hasDraft = new BehaviorSubject<() => boolean>(noDraft);

  const registerDraft = (check: () => boolean) => {
    hasDraft.next(check);

    return () => {
      if (hasDraft.value !== check) return;
      hasDraft.next(noDraft);
    };
  };

  const discardDraftThen = (action: () => void) => {
    if (!hasDraft.value()) {
      action();
      return;
    }

    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: () => {
        hasDraft.next(noDraft);
        action();
      },
    })();
  };

  const reset = () => {
    activeComment.next(undefined);
  };

  const setReplying = (comment: MediaComment, isReplying: boolean) => {
    discardDraftThen(() => activeComment.next({ id: comment.id, isReplying }));
  };

  return {
    activeComment: activeComment.asObservable(),
    setReplying,
    registerDraft,
    discardDraftThen,
    reset,
  };
}
