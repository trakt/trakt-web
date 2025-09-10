import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ToastContext } from './ToastContext.ts';

export const TOAST_CONTEXT = Symbol('toast');

export function createToastContext() {
  const ctx = setContext<ToastContext>(
    TOAST_CONTEXT,
    getContext<ToastContext>(TOAST_CONTEXT) ??
      {
        nowPlaying: writable(null),
        remainingMinutes: writable(0),
        progress: writable(0),
        lastWatched: writable(null),
      },
  );

  return ctx;
}
