import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { resetCoverImageRequest } from '$lib/requests/queries/users/resetCoverImageRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, map } from 'rxjs';

export function useResetCoverImage() {
  const isResettingCoverImage = new BehaviorSubject(false);

  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { confirm } = useConfirm();
  const { track } = useTrack(AnalyticsEvent.Settings);

  const resetCoverImage = confirm({
    type: ConfirmationType.ResetCoverImage,
    onConfirm: async () => {
      isResettingCoverImage.next(true);

      try {
        track({ settings: 'reset-cover-image' });
        await resetCoverImageRequest({});
        await invalidate(InvalidateAction.User.CoverImage);
      } finally {
        isResettingCoverImage.next(false);
      }
    },
  });

  return {
    resetCoverImage,
    hasCoverImage: user.pipe(map(($user) => Boolean($user.cover.url))),
    isResettingCoverImage: isResettingCoverImage.asObservable(),
  };
}
