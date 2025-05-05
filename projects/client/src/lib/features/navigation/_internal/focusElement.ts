export const focusElement = (
  element?: Element | null,
) => {
  if (!element) return;
  if (!(element instanceof HTMLElement)) return;

  element.focus();
};
