import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { whenSeenFor } from './whenSeenFor.ts';

const DURATION = 600;

type Callback = (entries: IntersectionObserverEntry[]) => void;

const observer: { callback: Callback | null; observed: Set<Element> } = {
  callback: null,
  observed: new Set(),
};

vi.stubGlobal(
  'IntersectionObserver',
  class {
    constructor(callback: Callback) {
      observer.callback = callback;
    }
    observe(target: Element) {
      observer.observed.add(target);
    }
    unobserve(target: Element) {
      observer.observed.delete(target);
    }
    disconnect() {}
  },
);

function emit(target: Element, isIntersecting: boolean) {
  observer.callback?.([
    { target, isIntersecting } as IntersectionObserverEntry,
  ]);
}

function mount() {
  const node = document.createElement('div');
  const callback = vi.fn();

  return {
    node,
    callback,
    action: whenSeenFor(node, { callback, duration: DURATION }),
  };
}

describe('action: whenSeenFor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fire once the element stays in view for the duration', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    vi.advanceTimersByTime(DURATION);

    expect(callback).toHaveBeenCalledOnce();
    action.destroy?.();
  });

  it('should not fire before the duration elapses', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    vi.advanceTimersByTime(DURATION - 1);

    expect(callback).not.toHaveBeenCalled();
    action.destroy?.();
  });

  it('should not fire when the element leaves the view early', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    vi.advanceTimersByTime(DURATION / 2);
    emit(node, false);
    vi.advanceTimersByTime(DURATION * 2);

    expect(callback).not.toHaveBeenCalled();
    action.destroy?.();
  });

  it('should restart the countdown when the element comes back', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    vi.advanceTimersByTime(DURATION / 2);
    emit(node, false);
    emit(node, true);
    vi.advanceTimersByTime(DURATION / 2);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DURATION / 2);

    expect(callback).toHaveBeenCalledOnce();
    action.destroy?.();
  });

  it('should fire only once and stop observing', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    vi.advanceTimersByTime(DURATION);
    emit(node, true);
    vi.advanceTimersByTime(DURATION);

    expect(callback).toHaveBeenCalledOnce();
    expect(observer.observed.has(node)).toBe(false);
    action.destroy?.();
  });

  it('should not fire after being destroyed', () => {
    const { node, callback, action } = mount();

    emit(node, true);
    action.destroy?.();
    vi.advanceTimersByTime(DURATION);

    expect(callback).not.toHaveBeenCalled();
    expect(observer.observed.has(node)).toBe(false);
  });
});
