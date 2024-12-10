export function disableTransitionOnComplete(
  node: HTMLImageElement,
) {
  if (!node.complete) {
    return;
  }

  node.style.setProperty('transition', 'none');
}
