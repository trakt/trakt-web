import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackWindowScroll } from './trackWindowScroll.ts';

const CLASS_NAME = 'is-scrolled';

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function scrollTo(y: number) {
  Object.defineProperty(globalThis.window, 'scrollY', {
    configurable: true,
    value: y,
  });
  globalThis.window.dispatchEvent(new Event('scroll'));
}

describe('action: trackWindowScroll', () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement('div');
    scrollTo(0);
  });

  afterEach(() => {
    scrollTo(0);
    vi.restoreAllMocks();
  });

  it('should reflect the initial scroll position immediately', () => {
    scrollTo(120);
    const action = trackWindowScroll(node, CLASS_NAME);

    expect(node.classList.contains(CLASS_NAME)).toBe(true);
    action.destroy();
  });

  it('should toggle the class on the next frame after scrolling', async () => {
    const action = trackWindowScroll(node, CLASS_NAME);

    scrollTo(120);
    expect(node.classList.contains(CLASS_NAME)).toBe(false);

    await nextFrame();
    expect(node.classList.contains(CLASS_NAME)).toBe(true);

    scrollTo(0);
    await nextFrame();
    expect(node.classList.contains(CLASS_NAME)).toBe(false);

    action.destroy();
  });

  it('should schedule a single frame for a burst of scroll events', async () => {
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame');
    const action = trackWindowScroll(node, CLASS_NAME);

    scrollTo(10);
    scrollTo(20);
    scrollTo(30);

    expect(raf).toHaveBeenCalledOnce();
    await nextFrame();
    action.destroy();
  });

  it('should stop updating once destroyed', async () => {
    const action = trackWindowScroll(node, CLASS_NAME);

    scrollTo(120);
    action.destroy();
    await nextFrame();

    expect(node.classList.contains(CLASS_NAME)).toBe(false);
  });
});
