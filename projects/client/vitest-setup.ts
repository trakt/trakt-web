//https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest';
import './test/mocks/navigation.mock.ts';
import './test/mocks/stores.mock.ts';

if (!globalThis.Element.prototype.animate) {
  globalThis.Element.prototype.animate = vi.fn().mockImplementation(
    function (_, options) {
      const animation = {
        onfinish: null,
        play: vi.fn(),
        pause: vi.fn(),
        finish: vi.fn().mockImplementation(function () {
          if (animation.onfinish) {
            (animation.onfinish as () => void)();
          }
        }),
        cancel: vi.fn(),
        reverse: vi.fn(),
        commitStyles: vi.fn(),
        persist: vi.fn(),
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        currentTime: 0,
        playbackRate: 1,
        startTime: 0,
        playState: 'idle',
      };
      setTimeout(() => {
        if (animation.onfinish) {
          (animation.onfinish as () => void)();
        }
      }, options.duration || 0);
      return animation;
    },
  );
}

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

import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './src/mocks/server.ts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
