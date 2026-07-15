/**
 * Shrinks a text node to `--font-size-text-small` (via the `small` class) when
 * it would overflow the height of its parent, restoring the default size when
 * it fits. Re-measures on parent resize.
 */
export function shrinkTextOnOverflow(node: HTMLElement) {
  const parent = node.parentElement;

  function update() {
    if (!parent) {
      return;
    }

    // Always measure at the default size before deciding.
    node.classList.remove('small');

    const overflows = node.scrollHeight > parent.clientHeight;
    node.classList.toggle('small', overflows);
  }

  update();

  // Parent height (not the node) drives available space, so observing it
  // avoids a resize loop when we toggle the font size on the node.
  const resizeObserver = new ResizeObserver(update);
  if (parent) {
    resizeObserver.observe(parent);
  }

  return {
    destroy() {
      resizeObserver.disconnect();
      node.classList.remove('small');
    },
  };
}
