import { BehaviorSubject } from 'rxjs';
import type { ActionToast } from '../models/ActionToast.ts';

function createActionToastStore() {
  const current = new BehaviorSubject<ActionToast | null>(null);

  return {
    subscribe: current.subscribe.bind(current),

    notify: (toast: Omit<ActionToast, 'id'>) => {
      const id = crypto.randomUUID();
      current.next({ ...toast, id });
      return id;
    },

    dismiss: (id?: string) => {
      if (id && current.value?.id !== id) {
        return;
      }

      current.next(null);
    },
  };
}

export const actionToastStore = createActionToastStore();
