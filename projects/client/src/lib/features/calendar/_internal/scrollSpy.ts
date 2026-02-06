export function scrollSpy(
  node: HTMLElement,
  params: { selector: string; onUpdate: (id: string) => void },
) {
  const visibilityMap = new Map<Element, number>();

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      visibilityMap.set(entry.target, entry.intersectionRatio);
    });

    let mostVisibleId = '';
    let maxRatio = 0;

    visibilityMap.forEach((ratio, element) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mostVisibleId = element.id;
      }
    });

    if (mostVisibleId) {
      params.onUpdate(mostVisibleId);
    }
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
    rootMargin: '-10% 0px -10% 0px',
  });

  const elements = node.querySelectorAll(params.selector);
  elements.forEach((el) => observer.observe(el));

  return {
    destroy() {
      observer.disconnect();
      visibilityMap.clear();
    },
  };
}
