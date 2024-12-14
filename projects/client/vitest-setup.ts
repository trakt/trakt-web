//https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest';

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

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './src/mocks/server.ts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
