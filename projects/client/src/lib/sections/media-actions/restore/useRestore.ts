import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { restoreShowCalendarRequest } from '$lib/requests/queries/users/restoreShowCalendarRequest.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { restoreShowProgressRequest } from '../../../requests/queries/users/restoreShowProgressRequest.ts';
import { toBulkPayload } from '../_internal/toBulkPayload.ts';

export type RestoreStoreProps = {
  ids: number[];
};

export function useRestore(
  props: RestoreStoreProps,
) {
  const { ids } = props;
  const { user } = useUser();
  const { track } = useTrack(AnalyticsEvent.Restore);

  const restoration = useMutation(defineMutation({
    key: 'show:restore',
    request: () => {
      const payload = {
        body: toBulkPayload('show', ids),
      };

      return Promise.all([
        restoreShowProgressRequest(payload),
        restoreShowCalendarRequest(payload),
      ]);
    },
    invalidations: [InvalidateAction.Restore],
  }));

  const restore = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    track();

    await restoration.mutate();
  };

  return {
    isRestoring: restoration.isPending,
    restore,
  };
}
