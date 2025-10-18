import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { setProfileImageRequest } from '$lib/requests/queries/users/setProfileImageRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

type UseProfileImageProps = {
  type: ExtendedMediaType;
  id: number;
};

export function useProfileImage({ type, id }: UseProfileImageProps) {
  const isSettingProfileImage = writable(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ProfileImage);

  const setProfileImage = async () => {
    isSettingProfileImage.set(true);

    track({ type });
    await setProfileImageRequest({ type, id });
    await invalidate(InvalidateAction.User.ProfileImage);

    isSettingProfileImage.set(false);
  };

  return {
    setProfileImage,
    isSettingProfileImage: derived(
      isSettingProfileImage,
      ($isSettingProfileImage) => $isSettingProfileImage,
    ),
  };
}
