const MIN_TOP_MARGIN = 0.2;

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

    const topmostId =
      Array.from(visibilityMap)
        .filter(([, ratio]) => ratio > 0)
        .map(([element]) => ({
          id: element.id,
          top: element.getBoundingClientRect().top,
        }))
        .toSorted((a, b) => a.top - b.top)
        .at(0)?.id ?? '';

    if (!topmostId || topmostId === lastId) return;

    lastId = topmostId;
    currentParams.onUpdate(topmostId);
  };

  const createObserver = (topMargin: number) =>
    new IntersectionObserver(observerCallback, {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: `-${topMargin}px 0px 0% 0px`,
    });

  const toTopMargin = (element: Element | null) => {
    const stickyTop = element
      ? parseFloat(getComputedStyle(element).scrollMarginTop) || 0
      : 0;
    return Math.round(
      Math.max(stickyTop, globalThis.window.innerHeight * MIN_TOP_MARGIN),
    );
  };

  let topMargin = 0;
  let observer = createObserver(topMargin);

  function observeElements() {
    observer.disconnect();
    visibilityMap.clear();
    lastId = '';
    const elements = node.querySelectorAll(currentParams.selector);
    const nextMargin = toTopMargin(elements.item(0));
    if (nextMargin !== topMargin) {
      topMargin = nextMargin;
      observer = createObserver(topMargin);
    }
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
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (!element) return;
        if (currentParams.skipVisible && isInViewport(element)) return;

        element.scrollIntoView({ block: 'start', behavior: 'auto' });
      }),
    );
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
