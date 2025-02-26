import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { restoreShowCalendarRequest } from '$lib/requests/queries/users/restoreShowCalendarRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import { restoreShowProgressRequest } from '../../../requests/queries/users/restoreShowProgressRequest.ts';
import { toRestorePayload } from './toRestorePayload.ts';

export type RestoreStoreProps = {
  ids: number[];
};

export function useRestore(
  props: RestoreStoreProps,
) {
  const { ids } = props;
  const isRestoring = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();

  const restore = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isRestoring.set(true);

    const payload = {
      body: toRestorePayload('show', ids),
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
    restore,
  };
}
