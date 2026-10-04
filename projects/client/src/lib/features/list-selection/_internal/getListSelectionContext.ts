import { getContext } from 'svelte';
import {
  LIST_SELECTION_CONTEXT_KEY,
  type ListSelectionContext,
} from './ListSelectionContext.ts';

export function getListSelectionContext(): ListSelectionContext {
  const context = getContext<ListSelectionContext>(
    LIST_SELECTION_CONTEXT_KEY,
  );

  if (!context) {
    throw new Error(
      'List selection context not found. Make sure to use this within the ListSelectionProvider scope.',
    );
  }

  return context;
}
