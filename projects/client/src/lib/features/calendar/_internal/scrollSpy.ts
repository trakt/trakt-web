export function scrollSpy(
  node: HTMLElement,
  params: {
    selector: string;
    onUpdate: (id: string) => void;
    initialId?: string;
  },
) {
  const visibilityMap = new Map<Element, number>();
  let currentParams = params;

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
      currentParams.onUpdate(mostVisibleId);
    }
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
    rootMargin: '-10% 0px -10% 0px',
  });

  function observeElements() {
    observer.disconnect();
    visibilityMap.clear();
    const elements = node.querySelectorAll(currentParams.selector);
    elements.forEach((el) => observer.observe(el));
  }

  observeElements();

  if (currentParams.initialId) {
    // Use requestAnimationFrame to ensure the DOM is fully rendered before scrolling
    requestAnimationFrame(() => {
      const el = node.querySelector(`#${currentParams.initialId}`);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    });
  }

  return {
    update(newParams: typeof params) {
      currentParams = newParams;
      observeElements();
    },
    destroy() {
      observer.disconnect();
      visibilityMap.clear();
    },
  };
}
