const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(',');

function isTabbable(element: HTMLElement) {
  if (element.closest('[inert]') !== null) return false;

  return element.checkVisibility?.() ?? true;
}

export function trapTabFocus(node: HTMLElement) {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const tabbable = Array.from(
      node.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
    ).filter(isTabbable);
    const first = tabbable.at(0);
    const last = tabbable.at(-1);

    if (!first || !last) {
      event.preventDefault();
      return;
    }

    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === node)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  node.addEventListener('keydown', onKeydown);

  return {
    destroy() {
      node.removeEventListener('keydown', onKeydown);
    },
  };
}
