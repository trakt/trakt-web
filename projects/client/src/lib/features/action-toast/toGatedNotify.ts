import type { ActionToast } from './models/ActionToast.ts';

type Notify = (toast: Omit<ActionToast, 'id'>) => void;

export function toGatedNotify(notify: Notify, isEnabled: boolean): Notify {
  return (toast) => {
    if (!isEnabled) {
      return;
    }

    notify(toast);
  };
}
