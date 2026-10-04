import { getContext } from 'svelte';
import {
  LIST_SELECTION_CONTEXT_KEY,
  type ListSelectionContext,
} from './ListSelectionContext.ts';

export function getListSelectionContext(): ListSelectionContext | Nil {
  return getContext<ListSelectionContext>(LIST_SELECTION_CONTEXT_KEY);
}
