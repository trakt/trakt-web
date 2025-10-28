import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { derived, writable } from 'svelte/store';
import type { ActiveComment } from '../models/ActiveComment.ts';

export function useActiveComment(source?: ActiveComment) {
  const activeComment = writable<ActiveComment | undefined>(source);

  const reset = () => {
    activeComment.set(undefined);
  };

  const setReplying = (comment: MediaComment, isReplying: boolean) => {
    activeComment.set({ id: comment.id, isReplying });
  };

  return {
    activeComment: derived(activeComment, ($activeComment) => $activeComment),
    setReplying,
    reset,
  };
}
