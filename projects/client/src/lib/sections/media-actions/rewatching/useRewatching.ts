import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { startShowRewatchingRequest } from '$lib/requests/queries/shows/startShowRewatchingRequest.ts';
import { stopShowRewatchingRequest } from '$lib/requests/queries/shows/stopShowRewatchingRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { firstValueFrom } from 'rxjs';
import { useIsRewatching } from './useIsRewatching.ts';

type UseRewatchingProps = {
  show: {
    id: number;
  };
};

export function useRewatching({ show }: UseRewatchingProps) {
  const { isEnabled } = useFeatureFlag();
  const isRewatchingFeatureEnabled = isEnabled(FeatureFlag.Rewatching);
  const { isRewatching } = useIsRewatching({
    type: 'show',
    media: show,
  });

  const rewatchingInvalidations = ({ data }: { data: boolean }) =>
    data
      ? [
        InvalidateAction.Rewatching('show'),
        InvalidateAction.MarkAsWatched('show'),
      ]
      : [];

  const start = useMutation(defineMutation({
    key: 'show:start-rewatching',
    request: () => startShowRewatchingRequest({ id: show.id }),
    invalidations: rewatchingInvalidations,
  }));

  const stop = useMutation(defineMutation({
    key: 'show:stop-rewatching',
    request: () => stopShowRewatchingRequest({ id: show.id }),
    invalidations: rewatchingInvalidations,
  }));

  const startRewatching = async () => {
    if (!(await firstValueFrom(isRewatchingFeatureEnabled))) {
      return false;
    }

    return await start.mutate();
  };

  const stopRewatching = async () => {
    if (!(await firstValueFrom(isRewatchingFeatureEnabled))) {
      return false;
    }

    return await stop.mutate();
  };

  const isUpdatingRewatching = anyTrue([start.isPending, stop.isPending]);

  return {
    isRewatching,
    isUpdatingRewatching,
    startRewatching,
    stopRewatching,
  };
}
