import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { reactCommentRequest } from '$lib/requests/queries/comments/reactCommentRequest.ts';
import { removeReactionCommentRequest } from '$lib/requests/queries/comments/removeReactionCommentRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';

type UseCommentReactionProps = {
  id: number;
};

export function useCommentReaction({ id }: UseCommentReactionProps) {
  const isReacting = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.React);

  const remove = async () => {
    isReacting.set(true);
    track({ action: 'remove', type: 'comment' });

    await removeReactionCommentRequest({ id });
    await invalidate(InvalidateAction.React);

    isReacting.set(false);
  };

  const react = async (reaction: Reaction) => {
    isReacting.set(true);
    track({ action: 'add', type: 'comment' });

    await removeReactionCommentRequest({ id });
    await reactCommentRequest({ id, reaction_type: reaction });
    await invalidate(InvalidateAction.React);

    isReacting.set(false);
  };

  return {
    isReacting,
    react,
    remove,
  };
}
