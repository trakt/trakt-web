import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type {
  ConfirmationContext,
  ConfirmationRequest,
} from './ConfirmationContext.ts';

export const CONFIRMATION_CONTEXT_KEY = Symbol('confirmation');

export function createConfirmationContext(): ConfirmationContext {
  const activeConfirmation = new BehaviorSubject<ConfirmationRequest | Nil>(
    null,
  );

  const showConfirmation = (request: ConfirmationRequest) => {
    activeConfirmation.next(request);
  };

  const hideConfirmation = () => {
    activeConfirmation.next(null);
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
