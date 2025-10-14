import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type {
  ConfirmationContext,
  ConfirmationRequest,
} from './ConfirmationContext.ts';

export const CONFIRMATION_CONTEXT_KEY = Symbol('confirmation');

export function createConfirmationContext(): ConfirmationContext {
  const activeConfirmation = writable<ConfirmationRequest | Nil>(null);

  const showConfirmation = (request: ConfirmationRequest) => {
    activeConfirmation.set(request);
  };

  const hideConfirmation = () => {
    activeConfirmation.set(null);
  };

  return setContext(
    CONFIRMATION_CONTEXT_KEY,
    getContext<ConfirmationContext>(CONFIRMATION_CONTEXT_KEY) ??
      {
        showConfirmation,
        hideConfirmation,
        activeConfirmation,
      },
  );
}
