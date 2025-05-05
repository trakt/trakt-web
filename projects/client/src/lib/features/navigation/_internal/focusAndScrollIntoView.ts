import { focusElement } from './focusElement.ts';

export const focusAndScrollIntoView = (
  element?: Element | null,
  behavior?: ScrollBehavior,
) => {
  focusElement(element);

  element?.scrollIntoView({
    block: 'center',
    inline: 'center',
    behavior: behavior ?? 'instant',
  });
};
