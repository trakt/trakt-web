import { getContext } from 'svelte';
import type { ConfirmationContext } from './ConfirmationContext.ts';
import { CONFIRMATION_CONTEXT_KEY } from './createConfirmationContext.ts';

export function getConfirmationContext(): ConfirmationContext {
  const context = getContext<ConfirmationContext>(CONFIRMATION_CONTEXT_KEY);
  if (!context) {
    throw new Error(
      'getConfirmationContext must be used within a ConfirmationProvider',
    );
  }
  return context;
}
