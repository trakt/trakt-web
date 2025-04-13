export const focusAndScrollIntoView = (element?: Element | null) => {
  if (!element) return;
  if (!(element instanceof HTMLElement)) return;

  element.focus();
  element.scrollIntoView({
    block: 'center',
    inline: 'center',
  });
};
