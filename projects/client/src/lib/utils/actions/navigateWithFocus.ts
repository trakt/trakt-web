import { goto } from '$app/navigation';

export function navigateWithFocus(node: HTMLAnchorElement) {
  const hrefUrl = new URL(node.href);
  const isExternalUrl = hrefUrl.origin !== origin;

  if (isExternalUrl) {
    return;
  }

  const handleNavigation = (event: MouseEvent | KeyboardEvent) => {
    if (
      event instanceof MouseEvent ||
      (event instanceof KeyboardEvent &&
        (event.key === 'Enter' || event.key === ' '))
    ) {
      event.preventDefault();

      goto(node.href)
        .then(() => node.focus());
    }
  };

  node.addEventListener('click', handleNavigation);
  node.addEventListener('keydown', handleNavigation);

  return {
    destroy() {
      node.removeEventListener('click', handleNavigation);
      node.removeEventListener('keydown', handleNavigation);
    },
  };
}
