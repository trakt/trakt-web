import { actionToastStore } from './_internal/actionToastStore.ts';
import type { ActionToast } from './models/ActionToast.ts';

/**
 * Public API for firing action-confirmation toasts from anywhere - typically
 * a mutation hook right after an add/remove/rate succeeds (or is queued
 * offline).
 *
 * `notify` is gated behind the `ActionConfirmations` feature flag inside the
 * store, so callers fire unconditionally and it becomes a no-op when the flag
 * is off. `dismiss` clears the current toast (pass the toast's own id to avoid
 * clobbering a newer one).
 */
export function useActionToast() {
  return {
    notify: (toast: Omit<ActionToast, 'id'>) => actionToastStore.notify(toast),
    dismiss: (id?: string) => actionToastStore.dismiss(id),
  };
}
