import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { startShowRewatchingRequest } from '$lib/requests/queries/shows/startShowRewatchingRequest.ts';
import { stopShowRewatchingRequest } from '$lib/requests/queries/shows/stopShowRewatchingRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { useIsRewatching } from './useIsRewatching.ts';

type UseRewatchingProps = {
  show: {
    id: number;
  };
};

export function useRewatching({ show }: UseRewatchingProps) {
  const isUpdatingRewatching = new BehaviorSubject(false);
  const { invalidateAll } = useInvalidator();
  const { isEnabled } = useFeatureFlag();
  const isRewatchingFeatureEnabled = isEnabled(FeatureFlag.Rewatching);
  const { isRewatching } = useIsRewatching({
    type: 'show',
    media: show,
  });

  const invalidateRewatching = () =>
    invalidateAll([
      InvalidateAction.Rewatching('show'),
      InvalidateAction.MarkAsWatched('show'),
    ]);

  const startRewatching = async () => {
    if (!(await firstValueFrom(isRewatchingFeatureEnabled))) {
      return false;
    }

    isUpdatingRewatching.next(true);

    try {
      const didStart = await startShowRewatchingRequest({ id: show.id });
      if (didStart) {
        await invalidateRewatching();
      }

      return didStart;
    } finally {
      isUpdatingRewatching.next(false);
    }
  };

  const stopRewatching = async () => {
    if (!(await firstValueFrom(isRewatchingFeatureEnabled))) {
      return false;
    }

    isUpdatingRewatching.next(true);

    try {
      const didStop = await stopShowRewatchingRequest({ id: show.id });
      if (didStop) {
        await invalidateRewatching();
      }

      return didStop;
    } finally {
      isUpdatingRewatching.next(false);
    }
  };

  return {
    isRewatching,
    isUpdatingRewatching,
    startRewatching,
    stopRewatching,
  };
}
