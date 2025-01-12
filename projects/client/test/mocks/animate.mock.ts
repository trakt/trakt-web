import { vi } from 'vitest';

if (!globalThis.Element.prototype.animate) {
  globalThis.Element.prototype.animate = vi.fn()
    .mockImplementation(
      (_, options) => {
        const animation = {
          onfinish: null,
          play: vi.fn(),
          pause: vi.fn(),
          finish: vi.fn()
            .mockImplementation(() => {
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
