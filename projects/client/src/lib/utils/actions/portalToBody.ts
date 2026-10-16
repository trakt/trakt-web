export function portalToBody(node: HTMLElement) {
  document.body.appendChild(node);

  return {
    destroy: () => node.remove(),
  };
}
