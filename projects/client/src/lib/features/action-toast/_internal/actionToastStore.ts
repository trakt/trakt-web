import { BehaviorSubject } from 'rxjs';
import type { ActionToast } from '../models/ActionToast.ts';

function createActionToastStore() {
  const current = new BehaviorSubject<ActionToast | null>(null);

  return {
    subscribe: current.subscribe.bind(current),

    notify: (toast: Omit<ActionToast, 'id'>) => {
      current.next({ ...toast, id: crypto.randomUUID() });
    },

    dismiss: () => current.next(null),
  };
}

export const actionToastStore = createActionToastStore();
