import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { restoreShowCalendarRequest } from '$lib/requests/queries/users/restoreShowCalendarRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import { restoreShowProgressRequest } from '../../../requests/queries/users/restoreShowProgressRequest.ts';
import { toBulkPayload } from '../_internal/toBulkPayload.ts';

export type RestoreStoreProps = {
  ids: number[];
  title: string;
};

export function useRestore(
  props: RestoreStoreProps,
) {
  const { ids } = props;
  const isRestoring = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Restore);
  const { confirm } = useConfirm();

  const restore = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isRestoring.set(true);
    track();

    const payload = {
      body: toBulkPayload('show', ids),
    };

    await Promise.all([
      restoreShowProgressRequest(payload),
      restoreShowCalendarRequest(payload),
    ]);

    await invalidate(InvalidateAction.Restore);

    isRestoring.set(false);
  };

  return {
    isRestoring,
    restore: confirm({
      type: ConfirmationType.RestoreShow,
      title: props.title,
      onConfirm: restore,
    }),
  };
}
