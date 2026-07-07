import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { SpotlightContext } from './SpotlightContext.ts';

export const SPOTLIGHT_CONTEXT_KEY = Symbol('spotlight');

export function createSpotlightContext(): SpotlightContext {
  const isOpen = new BehaviorSubject<boolean>(false);

  const open = () => isOpen.next(true);
  const close = () => isOpen.next(false);
  const toggle = () => isOpen.next(!isOpen.value);

  return setContext(
    SPOTLIGHT_CONTEXT_KEY,
    getContext<SpotlightContext>(SPOTLIGHT_CONTEXT_KEY) ??
      {
        isOpen,
        open,
        close,
        toggle,
      },
  );
}
