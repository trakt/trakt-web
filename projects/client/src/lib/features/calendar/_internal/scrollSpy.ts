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
    rootMargin: '-20% 0px 0% 0px',
  });

  function observeElements() {
    observer.disconnect();
    visibilityMap.clear();
    const elements = node.querySelectorAll(currentParams.selector);
    elements.forEach((el) => observer.observe(el));
  }

  function scrollToId(id: string) {
    requestAnimationFrame(() => {
      node.querySelector(`#${id}`)?.scrollIntoView({
        block: 'start',
        behavior: 'auto',
      });
    });
  }

  observeElements();

  if (currentParams.initialId) {
    scrollToId(currentParams.initialId);
  }

  return {
    update(newParams: typeof params) {
      const previousId = currentParams.initialId;
      currentParams = newParams;
      observeElements();

      if (newParams.initialId && newParams.initialId !== previousId) {
        scrollToId(newParams.initialId);
      }
    },
    destroy() {
      observer.disconnect();
      visibilityMap.clear();
    },
  };
}
