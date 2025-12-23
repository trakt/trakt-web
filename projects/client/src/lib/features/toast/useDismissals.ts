import { map } from 'rxjs';
import type { ActivityHistory } from '../../requests/queries/users/activityHistoryQuery.ts';
import { createDismissalStore } from './_internal/createDismissalStore.ts';
import { DISMISSAL_LIMIT } from './constants/index.ts';

const dismissalStore = createDismissalStore();

export function useDismissals() {
  return {
    dismissals: dismissalStore.dismissals.pipe(
      map((store) => store.items),
    ),
    dismiss: dismissalStore.dismiss,
    suppress: dismissalStore.suppress,
    isSuppressed: dismissalStore.dismissals.pipe(
      map((store) => store.isSuppressed),
    ),
    isAtLimit: dismissalStore.dismissals.pipe(
      map((store) => store.dismissalCount >= DISMISSAL_LIMIT),
    ),
    wasDismissed: (activity: ActivityHistory) => {
      const dismissedItems = dismissalStore.dismissals.value.items;

      return dismissedItems.some((dismissed) => {
        switch (activity.type) {
          case 'movie':
            return (
              dismissed.type === 'movie' &&
              dismissed.id === activity.movie.id.toString()
            );
          default:
            return false;
        }
      });
    },
  };
}
