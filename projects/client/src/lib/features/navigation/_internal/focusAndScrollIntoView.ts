export const focusAndScrollIntoView = (
  element?: Element | null,
  behavior?: ScrollBehavior,
) => {
  if (!element) return;
  if (!(element instanceof HTMLElement)) return;

  element.focus();
  element.scrollIntoView({
    block: 'center',
    inline: 'center',
    behavior: behavior ?? 'instant',
  });
};
