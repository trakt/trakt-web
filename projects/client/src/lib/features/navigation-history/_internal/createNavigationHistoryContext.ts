import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';

export const NAVIGATION_HISTORY_CONTEXT_KEY = Symbol('navigation_history');

export type NavigationHistoryContext = {
  internalNavigations: BehaviorSubject<number>;
};

export function createNavigationHistoryContext() {
  const ctx = setContext<NavigationHistoryContext>(
    NAVIGATION_HISTORY_CONTEXT_KEY,
    getContext<NavigationHistoryContext>(NAVIGATION_HISTORY_CONTEXT_KEY) ??
      {
        internalNavigations: new BehaviorSubject(0),
      },
  );

  return ctx;
}
