import type { BehaviorSubject } from 'rxjs';

export const EDIT_MODE_CONTEXT_KEY = Symbol('edit-mode-context');

export type EditModeContext = {
  isEditMode: BehaviorSubject<boolean>;
};
