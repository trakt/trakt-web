import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  commentReactionsQuery,
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { reactCommentRequest } from '$lib/requests/queries/comments/reactCommentRequest.ts';
import { removeReactionCommentRequest } from '$lib/requests/queries/comments/removeReactionCommentRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived, writable } from 'svelte/store';
import { getTopReactions } from './getTopReactions.ts';

type UseCommentReactionsProps = {
  id: number;
};

export function useCommentReactions({ id }: UseCommentReactionsProps) {
  const { user } = useUser();

  const isReacting = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.React);

  const reactions = useQuery(commentReactionsQuery({ id }));

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
    reactions: derived([reactions, user], ([$reactions, $user]) => {
      const data = $reactions?.data || [];

      // FIXME: relocate to useUser when endpoint is fixed
      const current = data.find((reaction) =>
        reaction.user.slug === $user?.slug
      )?.reaction;

      const top = getTopReactions(data);

      const restCount = data.length - top.length;

      return {
        current,
        top,
        restCount,
      };
    }),
    isLoading: derived(
      reactions,
      toLoadingState,
    ),
  };
}
