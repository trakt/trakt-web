import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { dropShowRequest } from '$lib/requests/queries/users/dropShowRequest.ts';
import { hideShowCalendarRequest } from '$lib/requests/queries/users/hideShowCalendarRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';

export type DropShowStoreProps = {
  ids: number[];
  title: string;
};

export function useDrop(
  props: DropShowStoreProps,
) {
  const { ids } = props;
  const isDropping = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Drop);
  const { confirm } = useConfirm();

  const drop = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isDropping.set(true);
    track();

    const body = toBulkPayload('show', ids);

    await Promise.all([
      dropShowRequest({ body }),
      /**
       * FIXME: This is a temporary solution to hide the show from the calendar
       * until we have a nitro version that takes drop state into account
       */
      hideShowCalendarRequest({ body }),
    ]);

    await invalidate(InvalidateAction.Drop);

    isDropping.set(false);
  };

  return {
    isDropping,
    drop: confirm({
      type: ConfirmationType.DropShow,
      title: props.title,
      onConfirm: drop,
    }),
  };
}
