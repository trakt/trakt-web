import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { resetCoverImageRequest } from '$lib/requests/queries/users/resetCoverImageRequest.ts';
import { map } from 'rxjs';

export function useResetCoverImage() {
  const { user } = useUser();
  const { confirm } = useConfirm();
  const { track } = useTrack(AnalyticsEvent.Settings);

  const reset = useMutation(defineMutation({
    key: 'user:reset-cover-image',
    request: () => resetCoverImageRequest({}),
    invalidations: [InvalidateAction.User.CoverImage],
  }));

  const resetCoverImage = confirm({
    type: ConfirmationType.ResetCoverImage,
    onConfirm: async () => {
      track({ settings: 'reset-cover-image' });

      await reset.mutate();
    },
  });

  return {
    resetCoverImage,
    hasCoverImage: user.pipe(map(($user) => Boolean($user.cover.url))),
    isResettingCoverImage: reset.isPending,
  };
}
