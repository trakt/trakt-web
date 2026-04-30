import { BehaviorSubject } from 'rxjs';
import { getContext } from 'svelte';
import { useCollapsedSection } from '../../stores/useCollapsedSection.ts';
import { NOOP_FN } from '../../utils/constants.ts';
import {
  EDIT_MODE_CONTEXT_KEY,
  type EditModeContext,
} from './_internal/EditModeContext.ts';

const HIDDEN_SECTION_PREFIX = 'list_hidden';

type UseEditModeOptions = {
  sectionId?: string;
};

// TODO always reset on navigate away
export function useEditMode({ sectionId }: UseEditModeOptions = {}) {
  const context = getContext<EditModeContext>(EDIT_MODE_CONTEXT_KEY);
  const section = sectionId
    ? useCollapsedSection(`${HIDDEN_SECTION_PREFIX}_${sectionId}`)
    : null;

  if (!context) {
    return {
      isEditMode: new BehaviorSubject(false),
      toggle: NOOP_FN,
      isHidden: section?.isCollapsed ?? new BehaviorSubject(false),
      toggleHidden: section?.toggle ?? NOOP_FN,
    };
  }

  const { isEditMode } = context;

  function toggle() {
    isEditMode.next(!isEditMode.value);
  }

  function exit() {
    isEditMode.next(false);
  }

  return {
    isEditMode,
    toggle,
    exit,
    isHidden: section?.isCollapsed ?? new BehaviorSubject(false),
    toggleHidden: section?.toggle ?? NOOP_FN,
  };
}
