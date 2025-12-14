import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { restoreShowCalendarRequest } from '$lib/requests/queries/users/restoreShowCalendarRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { BehaviorSubject } from 'rxjs';
import { restoreShowProgressRequest } from '../../../requests/queries/users/restoreShowProgressRequest.ts';
import { toBulkPayload } from '../_internal/toBulkPayload.ts';

export type RestoreStoreProps = {
  ids: number[];
};

export function useRestore(
  props: RestoreStoreProps,
) {
  const { ids } = props;
  const isRestoring = new BehaviorSubject(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Restore);

  const restore = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isRestoring.next(true);
    track();

    const payload = {
      body: toBulkPayload('show', ids),
    };

    await Promise.all([
      restoreShowProgressRequest(payload),
      restoreShowCalendarRequest(payload),
    ]);

    await invalidate(InvalidateAction.Restore);

    isRestoring.next(false);
  };

  return {
    isRestoring,
    restore,
  };
}
