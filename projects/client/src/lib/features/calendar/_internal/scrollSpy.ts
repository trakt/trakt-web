export function scrollSpy(
  node: HTMLElement,
  params: {
    selector: string;
    onUpdate: (id: string) => void;
    initialId?: string;
    skipVisible?: boolean;
  },
) {
  const visibilityMap = new Map<Element, number>();
  let currentParams = params;
  let lastId = '';
  let observeFrame = 0;

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

    if (!mostVisibleId || mostVisibleId === lastId) return;

    lastId = mostVisibleId;
    currentParams.onUpdate(mostVisibleId);
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
    rootMargin: '-20% 0px 0% 0px',
  });

  function observeElements() {
    observer.disconnect();
    visibilityMap.clear();
    lastId = '';
    const elements = node.querySelectorAll(currentParams.selector);
    elements.forEach((el) => observer.observe(el));
  }

  function scheduleObserveElements() {
    if (observeFrame) return;
    observeFrame = requestAnimationFrame(() => {
      observeFrame = 0;
      observeElements();
    });
  }

  function isInViewport(element: Element) {
    const { top } = element.getBoundingClientRect();
    return top >= 0 && top < globalThis.window.innerHeight;
  }

  function scrollToId(id: string) {
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;
      if (currentParams.skipVisible && isInViewport(element)) return;

      element.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  observeElements();

  if (currentParams.initialId) {
    scrollToId(currentParams.initialId);
  }

  const mutationObserver = new MutationObserver(scheduleObserveElements);

  mutationObserver.observe(node, { childList: true, subtree: true });

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
      if (observeFrame) cancelAnimationFrame(observeFrame);
      observer.disconnect();
      mutationObserver.disconnect();
      visibilityMap.clear();
    },
  };
}
