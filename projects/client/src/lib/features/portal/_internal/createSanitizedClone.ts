export function createSanitizedClone(target: HTMLElement) {
  const clone = target.cloneNode(true) as HTMLElement;
  const svgElements = clone.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    const defs = svg.querySelectorAll('defs');
    defs.forEach((def) => def.remove());
  });

  return clone;
}
