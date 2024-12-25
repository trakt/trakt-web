(globalThis as Record<string, unknown>).IntersectionObserver =
  class IntersectionObserver {
    constructor(
      callback: (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => void,
      _options: IntersectionObserver,
    ) {
      callback([{
        isIntersecting: true,
        intersectionRatio: 0,
        time: performance.now(),
        boundingClientRect: new DOMRectReadOnly(),
        intersectionRect: new DOMRectReadOnly(),
        rootBounds: null,
        target: document.createElement('div'),
      }], this);
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  };
