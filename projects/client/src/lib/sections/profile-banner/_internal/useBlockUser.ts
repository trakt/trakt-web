import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { blockUserRequest } from '$lib/requests/queries/users/blockUserRequest.ts';
import { unblockUserRequest } from '$lib/requests/queries/users/unblockUserRequest.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
export function useBlockUser() {
  const { track } = useTrack(AnalyticsEvent.Block);

  const block = useMutation(defineMutation({
    key: 'user:block',
    request: (slug: string) => blockUserRequest({ slug }),
    invalidations: [InvalidateAction.User.Block, InvalidateAction.User.Follow],
  }));

  const unblock = useMutation(defineMutation({
    key: 'user:unblock',
    request: (slug: string) => unblockUserRequest({ slug }),
    invalidations: [InvalidateAction.User.Block],
  }));

  const blockUser = async (slug: string) => {
    track({ action: 'block' });

    await block.mutate(slug);
  };

  const unblockUser = async (slug: string) => {
    track({ action: 'unblock' });

    await unblock.mutate(slug);
  };

  const isRequestingBlock = anyTrue([block.isPending, unblock.isPending]);

  return {
    isRequestingBlock,
    blockUser,
    unblockUser,
  };
}
