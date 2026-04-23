import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { blockUserRequest } from '$lib/requests/queries/users/blockUserRequest.ts';
import { unblockUserRequest } from '$lib/requests/queries/users/unblockUserRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

export function useBlockUser() {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Block);
  const isRequestingBlock = new BehaviorSubject(false);

  const blockUser = async (slug: string) => {
    isRequestingBlock.next(true);

    try {
      track({ action: 'block' });
      await blockUserRequest({ slug });
      await Promise.all([
        invalidate(InvalidateAction.User.Block),
        invalidate(InvalidateAction.User.Follow),
      ]);
    } finally {
      isRequestingBlock.next(false);
    }
  };

  const unblockUser = async (slug: string) => {
    isRequestingBlock.next(true);

    try {
      track({ action: 'unblock' });
      await unblockUserRequest({ slug });
      await invalidate(InvalidateAction.User.Block);
    } finally {
      isRequestingBlock.next(false);
    }
  };

  return {
    isRequestingBlock,
    blockUser,
    unblockUser,
  };
}
