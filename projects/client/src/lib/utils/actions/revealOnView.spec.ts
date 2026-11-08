import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('action: revealOnView', () => {
  let fire: (target: Element) => void;
  let revealOnView: typeof import('./revealOnView.ts').revealOnView;

  const placeAt = (top: number) => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({ top }) as DOMRect;
    return element;
  };

  const stubReducedMotion = (matches: boolean) =>
    vi.stubGlobal('matchMedia', () => ({ matches }) as MediaQueryList);

  beforeEach(async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          fire = (target) =>
            callback(
              [{ isIntersecting: true, target } as IntersectionObserverEntry],
              this as unknown as IntersectionObserver,
            );
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    stubReducedMotion(false);
    vi.resetModules();
    ({ revealOnView } = await import('./revealOnView.ts'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should leave an element that starts in view untouched', () => {
    const element = placeAt(0);

    revealOnView(element);

    expect(element.dataset.reveal).toBeUndefined();
  });

  it('should hold a below-the-fold element until it scrolls into view', () => {
    const element = placeAt(globalThis.innerHeight + 100);

    revealOnView(element, { delay: 80 });

    expect(element.dataset.reveal).toBe('pending');
    expect(element.style.getPropertyValue('--reveal-delay')).toBe('80ms');

    fire(element);

    expect(element.dataset.reveal).toBe('shown');
  });

  it('should skip the motion when the viewer prefers reduced motion', () => {
    stubReducedMotion(true);
    const element = placeAt(globalThis.innerHeight + 100);

    revealOnView(element);

    expect(element.dataset.reveal).toBeUndefined();
  });

  it('should clear the reveal state on destroy', () => {
    const element = placeAt(globalThis.innerHeight + 100);

    revealOnView(element).destroy?.();

    expect(element.dataset.reveal).toBeUndefined();
  });
});
