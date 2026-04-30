import { getContext } from 'svelte';
import {
  EDIT_MODE_CONTEXT_KEY,
  type EditModeContext,
} from './EditModeContext.ts';

export function getEditModeContext() {
  const context = getContext<EditModeContext>(EDIT_MODE_CONTEXT_KEY);

  if (!context) {
    throw new Error(
      'Edit mode context not found. Make sure to use this within the EditModeProvider scope.',
    );
  }

  return context;
}
