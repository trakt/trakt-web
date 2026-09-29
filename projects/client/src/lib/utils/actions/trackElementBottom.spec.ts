import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackElementBottom } from './trackElementBottom.ts';

const VAR_NAME = '--test-bottom';

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function readVar() {
  return document.documentElement.style.getPropertyValue(VAR_NAME);
}

function scroll() {
  globalThis.window.dispatchEvent(new Event('scroll'));
}

describe('action: trackElementBottom', () => {
  let node: HTMLElement;
  let bottom: number;
  let resize: () => void;

  beforeEach(() => {
    node = document.createElement('div');
    bottom = 64;
    vi.spyOn(node, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, 100, bottom),
    );
    resize = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should write the initial bottom immediately', () => {
    const action = trackElementBottom(node, VAR_NAME);

    expect(readVar()).toBe('64px');
    action.destroy();
  });

  it('should update the bottom on the next frame after scrolling', async () => {
    const action = trackElementBottom(node, VAR_NAME);

    bottom = 32.4;
    scroll();
    expect(readVar()).toBe('64px');

    await nextFrame();
    expect(readVar()).toBe('32px');

    action.destroy();
  });

  it('should schedule a single frame for a burst of scroll events', async () => {
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame');
    const action = trackElementBottom(node, VAR_NAME);

    scroll();
    scroll();
    scroll();

    expect(raf).toHaveBeenCalledOnce();
    await nextFrame();
    action.destroy();
  });

  it('should not rewrite the variable when the bottom is unchanged', async () => {
    const action = trackElementBottom(node, VAR_NAME);
    const setProperty = vi.spyOn(
      document.documentElement.style,
      'setProperty',
    );

    scroll();
    await nextFrame();

    expect(setProperty).not.toHaveBeenCalled();
    action.destroy();
  });

  it('should update immediately on resize', () => {
    const action = trackElementBottom(node, VAR_NAME);

    bottom = 100;
    resize();

    expect(readVar()).toBe('100px');
    action.destroy();
  });

  it('should remove the variable and stop updating once destroyed', async () => {
    const action = trackElementBottom(node, VAR_NAME);

    bottom = 10;
    scroll();
    action.destroy();
    await nextFrame();

    expect(readVar()).toBe('');
  });
});
