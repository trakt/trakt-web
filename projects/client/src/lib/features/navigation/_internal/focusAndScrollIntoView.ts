import { CTA_LIST_CARD_CLASS } from '$lib/sections/lists/components/cta/constants.ts';
import { focusElement } from './focusElement.ts';

export const focusAndScrollIntoView = (
  element?: Element | null,
  behavior?: ScrollBehavior,
) => {
  focusElement(element);

  if (element?.classList.contains(CTA_LIST_CARD_CLASS)) {
    return;
  }

  element?.scrollIntoView({
    block: 'center',
    inline: 'center',
    behavior: behavior ?? 'instant',
  });
};
