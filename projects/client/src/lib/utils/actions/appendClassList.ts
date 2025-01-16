export function appendClassList(node: HTMLElement, classList: string) {
  classList
    .split(' ')
    .filter(Boolean)
    .forEach((className) => {
      node.classList.add(className);
    });
}
