import { BehaviorSubject } from 'rxjs';
import type { ActionToast } from '../models/ActionToast.ts';

function createActionToastStore() {
  const current = new BehaviorSubject<ActionToast | null>(null);

  let isEnabled = false;

  return {
    subscribe: current.subscribe.bind(current),

    setEnabled: (value: boolean) => {
      isEnabled = value;
      if (!value) {
        current.next(null);
      }
    },

    notify: (toast: Omit<ActionToast, 'id'>) => {
      if (!isEnabled) {
        return;
      }

      current.next({ ...toast, id: crypto.randomUUID() });
    },

    dismiss: (id?: string) => {
      const value = current.getValue();
      if (!value) {
        return;
      }

      // A stale auto-dismiss must not clear the toast that replaced it.
      if (id && value.id !== id) {
        return;
      }

      current.next(null);
    },
  };
}

export const actionToastStore = createActionToastStore();
