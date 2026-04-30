import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import {
  EDIT_MODE_CONTEXT_KEY,
  type EditModeContext,
} from './EditModeContext.ts';

export function createEditModeContext() {
  const ctx = setContext<EditModeContext>(
    EDIT_MODE_CONTEXT_KEY,
    getContext<EditModeContext>(EDIT_MODE_CONTEXT_KEY) ??
      {
        isEditMode: new BehaviorSubject(false),
      },
  );

  return ctx;
}
