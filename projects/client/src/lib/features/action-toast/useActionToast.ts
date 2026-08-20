import { actionToastStore } from './_internal/actionToastStore.ts';
import type { ActionToast } from './models/ActionToast.ts';

export function useActionToast() {
  return {
    notify: (toast: Omit<ActionToast, 'id'>) => actionToastStore.notify(toast),
    dismiss: (id?: string) => actionToastStore.dismiss(id),
  };
}
