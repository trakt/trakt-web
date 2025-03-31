type DisableNavigationProps = { disabled?: boolean };

export function disableNavigation(
  node: HTMLElement,
  props: DisableNavigationProps,
) {
  node.addEventListener('click', (ev) => {
    if (!props.disabled) {
      return;
    }

    ev.stopPropagation();
    ev.preventDefault();
  });
}
