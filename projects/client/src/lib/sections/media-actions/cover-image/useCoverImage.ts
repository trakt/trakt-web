import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { setCoverImageRequest } from '$lib/requests/queries/users/setCoverImageRequest.ts';

type UseCoverImageProps = {
  type: ExtendedMediaType;
  id: number;
  title: string;
  coverUrl?: HttpsUrl | Nil;
};

export function useCoverImage(
  { type, id, title, coverUrl }: UseCoverImageProps,
) {
  const { confirm } = useConfirm();
  const { track } = useTrack(AnalyticsEvent.CoverImage);

  const setting = useMutation(defineMutation({
    key: 'user:set-cover-image',
    request: () => setCoverImageRequest({ type, id }),
    invalidations: [InvalidateAction.User.CoverImage],
  }));

  const setCoverImage = confirm({
    type: ConfirmationType.SetCoverImage,
    title,
    previewUrl: coverUrl,
    onConfirm: async () => {
      track({ type });

      await setting.mutate();
    },
  });

  return {
    setCoverImage,
    isSettingCoverImage: setting.isPending,
  };
}
