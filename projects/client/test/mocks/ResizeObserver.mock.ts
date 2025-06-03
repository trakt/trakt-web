(globalThis as Record<string, unknown>).ResizeObserver = class ResizeObserver {
  constructor(
    callback: (
      entries: ResizeObserverEntry[],
      observer: ResizeObserver,
    ) => void,
  ) {
    callback([{
      borderBoxSize: [{
        blockSize: 100,
        inlineSize: 100,
      }],
      contentBoxSize: [{
        blockSize: 80,
        inlineSize: 80,
      }],
      contentRect: new DOMRectReadOnly(0, 0, 80, 80),
      devicePixelContentBoxSize: [{
        blockSize: 80,
        inlineSize: 80,
      }],
      target: document.createElement('div'),
    }], this);
  }
  observe() {}
  disconnect() {}
  unobserve() {}
};
