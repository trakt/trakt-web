import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { dropShowRequest } from '$lib/requests/queries/users/dropShowRequest.ts';
import { hideShowCalendarRequest } from '$lib/requests/queries/users/hideShowCalendarRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import { toDropPayload } from './toDropPayload.ts';

export type DropShowStoreProps = {
  ids: number[];
};

export function useDrop(
  props: DropShowStoreProps,
) {
  const { ids } = props;
  const isDropping = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();

  const drop = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isDropping.set(true);

    const body = toDropPayload('show', ids);

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
    drop,
  };
}
