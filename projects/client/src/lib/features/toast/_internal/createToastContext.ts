import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { ToastContext } from './ToastContext.ts';

export const TOAST_CONTEXT = Symbol('toast');

export function createToastContext() {
  const ctx = setContext<ToastContext>(
    TOAST_CONTEXT,
    getContext<ToastContext>(TOAST_CONTEXT) ??
      {
        nowPlaying: new BehaviorSubject(null),
        remainingMinutes: new BehaviorSubject(0),
        progress: new BehaviorSubject(0),
        lastWatched: new BehaviorSubject(null),
      },
  );

  return ctx;
}
