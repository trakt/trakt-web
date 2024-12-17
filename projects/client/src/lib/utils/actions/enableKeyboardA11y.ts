export function enableKeyboardA11y(node: HTMLElement) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const isElement = event.target instanceof HTMLElement;
    if (!isElement) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      event.target.click();
    }
  };

  node.addEventListener('keydown', handleKeyDown);

  return {
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    },
  };
}
