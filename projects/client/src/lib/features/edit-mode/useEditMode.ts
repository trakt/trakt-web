import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { BehaviorSubject, Observable } from 'rxjs';
import { getContext } from 'svelte';
import { useCollapsedSection } from '../../stores/useCollapsedSection.ts';
import { NOOP_FN } from '../../utils/constants.ts';
import {
  EDIT_MODE_CONTEXT_KEY,
  type EditModeContext,
} from './_internal/EditModeContext.ts';

const hiddenSectionPrefix = 'hidden_section';

// If these values are changed, also update edit-mode.css
const editModeClass = 'trakt-edit-mode';
const editModeHiddenClass = 'is-hidden';

type EditModeSection = {
  toggle: () => void;
  isHidden: Observable<boolean>;
  action: (node: HTMLElement) => { destroy: () => void };
};

type UseEditModeReturn = {
  isEditMode: BehaviorSubject<boolean>;
  toggle: () => void;
  exit: () => void;
  section: (id: string) => EditModeSection;
};

export function useEditMode(): UseEditModeReturn {
  const context = getContext<EditModeContext>(EDIT_MODE_CONTEXT_KEY);
  const { track } = useTrack(AnalyticsEvent.EditMode);

  if (!context) {
    const falseSubject = new BehaviorSubject<boolean>(false);
    return {
      isEditMode: falseSubject,
      toggle: NOOP_FN,
      exit: NOOP_FN,
      section: () => ({
        action: () => ({ destroy: NOOP_FN }),
        toggle: NOOP_FN,
        isHidden: falseSubject,
      }),
    };
  }

  const { isEditMode } = context;

  function toggle() {
    track({ enabled: !isEditMode.value });
    isEditMode.next(!isEditMode.value);
  }

  function exit() {
    track({ enabled: false });
    isEditMode.next(false);
  }

  return {
    isEditMode,
    toggle,
    exit,
    section: (id: string) => {
      const section = useCollapsedSection(`${hiddenSectionPrefix}_${id}`);

      return {
        toggle: section.toggle,
        isHidden: section.isCollapsed,
        action: (node: HTMLElement) => {
          const isHidden = section.isCollapsed;

          const editModeSubscription = isEditMode.subscribe((value) =>
            node.classList.toggle(editModeClass, value)
          );
          const hiddenSubscription = isHidden.subscribe((value) =>
            node.classList.toggle(editModeHiddenClass, value)
          );

          return {
            destroy() {
              editModeSubscription.unsubscribe();
              hiddenSubscription.unsubscribe();
            },
          };
        },
      };
    },
  };
}
