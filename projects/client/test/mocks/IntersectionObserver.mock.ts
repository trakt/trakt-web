type Callback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void;

(globalThis as Record<string, unknown>).IntersectionObserver =
  class MockIntersectionObserver {
    #callback: Callback;
    constructor(
      callback: Callback,
      _options?: IntersectionObserverInit,
    ) {
      this.#callback = callback;
    }
    observe(target: Element) {
      const entry = {
        isIntersecting: true,
        intersectionRatio: 1,
        time: performance.now(),
        boundingClientRect: new DOMRectReadOnly(),
        intersectionRect: new DOMRectReadOnly(),
        rootBounds: null,
        target,
      } as IntersectionObserverEntry;
      this.#callback([entry], this as unknown as IntersectionObserver);
    }
    disconnect() {}
    unobserve() {}
  };
