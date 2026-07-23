import { BehaviorSubject } from 'rxjs';
import type { ActionToast } from '../models/ActionToast.ts';

/**
 * Global, single-slot confirmation-toast queue. Only one toast is visible at a
 * time; a newer `notify` replaces whatever is showing (latest action wins),
 * which naturally dedupes bursts from bulk mutations.
 *
 * The whole engine is gated behind the `ActionConfirmations` feature flag.
 * `notify` is a no-op until `ActionToastHost` mounts and flips `setEnabled`
 * from the flag, so callers never need to check the flag themselves.
 *
 * Kept as a module singleton (mirrors `markAsWatchedDrawerStore` and
 * `createDismissalStore`) so any mutation hook can fire a toast without a
 * provider in scope. The public surface is `useActionToast`.
 */
function createActionToastStore() {
  const current = new BehaviorSubject<ActionToast | null>(null);

  let isEnabled = false;
  let counter = 0;

  return {
    subscribe: current.subscribe.bind(current),

    setEnabled: (value: boolean) => {
      isEnabled = value;
      // Flipping the flag off mid-session clears anything on screen.
      if (!value) {
        current.next(null);
      }
    },

    notify: (toast: Omit<ActionToast, 'id'>) => {
      if (!isEnabled) {
        return;
      }

      counter += 1;
      current.next({ ...toast, id: `action-toast-${counter}` });
    },

    dismiss: (id?: string) => {
      const value = current.getValue();
      if (!value) {
        return;
      }

      // A stale timer/close from a toast that has already been replaced must
      // not clear the newer one - only dismiss when the id still matches.
      if (id && value.id !== id) {
        return;
      }

      current.next(null);
    },
  };
}

export const actionToastStore = createActionToastStore();
