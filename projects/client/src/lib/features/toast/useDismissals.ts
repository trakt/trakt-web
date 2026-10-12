import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { ActivityHistory } from '../../requests/queries/users/activityHistoryQuery.ts';
import { toDismissalKey } from './_internal/toDismissalKey.ts';

function toActivityKey(activity: ActivityHistory): string | null {
  switch (activity.type) {
    case 'movie':
      return toDismissalKey({ type: 'movie', id: activity.movie.id });
    case 'episode':
      return toDismissalKey({ type: 'show', id: activity.show.id });
    default:
      return null;
  }
}

export function useDismissals() {
  const dismissals = useClientRecord(ClientStateKey.DismissedRateNow);

  return {
    dismiss: (id: number, type: ExtendedMediaType) =>
      dismissals.set(toDismissalKey({ type, id }), Date.now()),
    wasDismissed: (activity: ActivityHistory) => {
      const key = toActivityKey(activity);
      return key !== null && dismissals.current(key) !== undefined;
    },
  };
}
