import type { ActionReturn } from 'svelte/action';

export function whenInViewport(
  element: HTMLElement,
  callback: () => void,
): ActionReturn<undefined> {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 },
  );

  if (element) {
    observer.observe(element);
  }

  return {
    destroy: () => {
      if (element) {
        observer.unobserve(element);
      }
    },
  };
}
