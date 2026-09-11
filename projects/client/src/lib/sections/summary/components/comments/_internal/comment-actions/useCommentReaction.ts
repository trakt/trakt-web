import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type Reaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import { reactCommentRequest } from '$lib/requests/queries/comments/reactCommentRequest.ts';
import { removeReactionCommentRequest } from '$lib/requests/queries/comments/removeReactionCommentRequest.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
type UseCommentReactionProps = {
  id: number;
};

export function useCommentReaction({ id }: UseCommentReactionProps) {
  const { track } = useTrack(AnalyticsEvent.React);

  const removal = useMutation(defineMutation({
    key: 'comment:remove-reaction',
    request: () => removeReactionCommentRequest({ id }),
    invalidations: [InvalidateAction.React],
  }));

  const reaction = useMutation(defineMutation({
    key: 'comment:react',
    request: async (reaction: Reaction) => {
      await removeReactionCommentRequest({ id });
      return await reactCommentRequest({ id, reaction_type: reaction });
    },
    invalidations: [InvalidateAction.React],
  }));

  const isReacting = anyTrue([removal.isPending, reaction.isPending]);

  const remove = async () => {
    track({ action: 'remove', type: 'comment' });

    await removal.mutate();
  };

  const react = async (type: Reaction) => {
    track({ action: 'add', type: 'comment' });

    await reaction.mutate(type);
  };

  return {
    isReacting,
    react,
    remove,
  };
}
