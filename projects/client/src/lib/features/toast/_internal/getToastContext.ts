import { getContext } from 'svelte';
import { TOAST_CONTEXT } from './createToastContext.ts';
import type { ToastContext } from './ToastContext.ts';

export function getToastContext() {
  const context = getContext<ToastContext>(TOAST_CONTEXT);
  if (!context) {
    throw new Error(
      'Toast context not found. Make sure to call use this within the ToastProvider scope.',
    );
  }
  return context;
}
