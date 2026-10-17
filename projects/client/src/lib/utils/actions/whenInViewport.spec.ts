import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Observer = {
  readonly options: IntersectionObserverInit | undefined;
  readonly observed: Set<Element>;
  fire: (target: Element) => void;
};

describe('action: whenInViewport', () => {
  let observers: Observer[];
  let whenInViewport: typeof import('./whenInViewport.ts').whenInViewport;

  beforeEach(async () => {
    observers = [];
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        readonly #callback: IntersectionObserverCallback;
        readonly #observed = new Set<Element>();

        constructor(
          callback: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          this.#callback = callback;
          observers.push({
            options,
            observed: this.#observed,
            fire: (target) =>
              this.#callback(
                [{ isIntersecting: true, target } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver,
              ),
          });
        }
        observe(target: Element) {
          this.#observed.add(target);
        }
        unobserve(target: Element) {
          this.#observed.delete(target);
        }
        disconnect() {}
      },
    );
    vi.resetModules();
    ({ whenInViewport } = await import('./whenInViewport.ts'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should call a plain callback once the element intersects', () => {
    const element = document.createElement('div');
    const callback = vi.fn<() => void>();

    whenInViewport(element, callback);
    observers.at(0)?.fire(element);

    expect(callback).toHaveBeenCalledOnce();
    expect(observers.at(0)?.observed.has(element)).toBe(false);
  });

  it('should observe with only the default threshold when no rootMargin is given', () => {
    whenInViewport(document.createElement('div'), vi.fn<() => void>());

    expect(observers).toHaveLength(1);
    expect(observers.at(0)?.options?.threshold).toBe(0.1);
    expect(observers.at(0)?.options?.rootMargin).toBeUndefined();
  });

  it('should pass rootMargin to the observer', () => {
    const element = document.createElement('div');
    const callback = vi.fn<() => void>();

    whenInViewport(element, { callback, rootMargin: '200px' });
    observers.at(0)?.fire(element);

    expect(observers.at(0)?.options?.rootMargin).toBe('200px');
    expect(callback).toHaveBeenCalledOnce();
  });

  it('should share one observer per config and split different configs', () => {
    whenInViewport(document.createElement('div'), vi.fn<() => void>());
    whenInViewport(document.createElement('div'), vi.fn<() => void>());
    whenInViewport(document.createElement('div'), {
      callback: vi.fn<() => void>(),
      rootMargin: '200px',
    });
    whenInViewport(document.createElement('div'), {
      callback: vi.fn<() => void>(),
      rootMargin: '200px',
    });

    expect(observers).toHaveLength(2);
  });

  it('should only call the callback of the element that intersected', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const firstCallback = vi.fn<() => void>();
    const secondCallback = vi.fn<() => void>();

    whenInViewport(first, firstCallback);
    whenInViewport(second, secondCallback);
    observers.at(0)?.fire(second);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledOnce();
  });

  it('should stop observing on destroy', () => {
    const element = document.createElement('div');
    const callback = vi.fn<() => void>();

    const action = whenInViewport(element, callback);
    action?.destroy?.();
    observers.at(0)?.fire(element);

    expect(observers.at(0)?.observed.has(element)).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });
});
