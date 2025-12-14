import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { setCoverImageRequest } from '$lib/requests/queries/users/setCoverImageRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type UseCoverImageProps = {
  type: ExtendedMediaType;
  id: number;
};

export function useCoverImage({ type, id }: UseCoverImageProps) {
  const isSettingCoverImage = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.CoverImage);

  const setCoverImage = async () => {
    isSettingCoverImage.next(true);

    track({ type });
    await setCoverImageRequest({ type, id });
    await invalidate(InvalidateAction.User.CoverImage);

    isSettingCoverImage.next(false);
  };

  return {
    setCoverImage,
    isSettingCoverImage: isSettingCoverImage.asObservable(),
  };
}
