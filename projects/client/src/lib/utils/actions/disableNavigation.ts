export function disableNavigation(
  node: HTMLElement,
  disabled?: boolean,
) {
  function handleClick(ev: MouseEvent) {
    if (!disabled) {
      return;
    }

    ev.stopPropagation();
    ev.preventDefault();
  }

  node.addEventListener('click', handleClick);

  return {
    update(updatedState: boolean) {
      disabled = updatedState;
    },
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}
