import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollActiveItemIntoView } from './scrollActiveItemIntoView.ts';

function rect({ left, width }: { left: number; width: number }) {
  return { left, width, right: left + width } as DOMRect;
}

function setup({ scrollLeft = 0 }: { scrollLeft?: number } = {}) {
  const parent = document.createElement('div');
  const element = document.createElement('div');
  parent.appendChild(element);

  const scrollTo = vi.fn();
  Object.assign(parent, { scrollTo });
  Object.defineProperty(parent, 'clientWidth', { value: 400 });
  parent.scrollLeft = scrollLeft;
  parent.getBoundingClientRect = () => rect({ left: 100, width: 400 });

  return { parent, element, scrollTo };
}

describe('action: scrollActiveItemIntoView', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should scroll an out of view active item relative to the scroller', () => {
    const { element, scrollTo } = setup();
    element.getBoundingClientRect = () => rect({ left: 900, width: 200 });

    scrollActiveItemIntoView(element, true);

    expect(scrollTo).toHaveBeenCalledWith({ left: 792, behavior: 'instant' });
  });

  it('should not scroll when the active item is already visible', () => {
    const { element, scrollTo } = setup();
    element.getBoundingClientRect = () => rect({ left: 150, width: 200 });

    scrollActiveItemIntoView(element, true);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('should not scroll when the item is not active', () => {
    const { element, scrollTo } = setup();
    element.getBoundingClientRect = () => rect({ left: 900, width: 200 });

    scrollActiveItemIntoView(element, false);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('should scroll smoothly when the item becomes active', () => {
    const { element, scrollTo } = setup();
    element.getBoundingClientRect = () => rect({ left: 900, width: 200 });

    const { update } = scrollActiveItemIntoView(element, false);
    update(true);

    expect(scrollTo).toHaveBeenCalledWith({ left: 792, behavior: 'smooth' });
  });
});
