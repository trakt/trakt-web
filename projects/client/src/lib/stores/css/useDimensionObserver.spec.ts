import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDimensionObserver } from './useDimensionObserver.ts';

describe('useDimensionObserver', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const disconnectSpy = vi.fn();
  let resizeCallbacks: ResizeObserverCallback[] = [];

  function getDomRect(x: number, y: number, size: number): DOMRect {
    return {
      x,
      y,
      top: y,
      left: x,
      right: x + size,
      bottom: y + size,
      width: size,
      height: size,
      toJSON: () => {},
    };
  }

  function resize(node: HTMLElement) {
    const entry = { target: node } as unknown as ResizeObserverEntry;
    resizeCallbacks.forEach((callback) =>
      callback([entry], {} as ResizeObserver)
    );
  }

  beforeEach(() => {
    resizeCallbacks = [];
    disconnectSpy.mockClear();

    (globalThis as Record<string, unknown>).ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect = disconnectSpy;
    };
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('should observe width changes of the node', async () => {
    const node = document.createElement('div');
    const { observeDimension, observedDimension } = useDimensionObserver(
      'width',
    );

    const component = await renderStore(() => observeDimension(node));
    expect(observedDimension.value).toBe(0);

    const width = 100;
    vi.spyOn(node, 'getBoundingClientRect')
      .mockReturnValueOnce(getDomRect(0, 0, width));
    resize(node);

    expect(await waitForEmission(observedDimension, 2)).toBe(width);

    component.destroy();
  });

  it('should observe height changes of the node', async () => {
    const node = document.createElement('div');
    const { observeDimension, observedDimension } = useDimensionObserver(
      'height',
    );

    const component = await renderStore(() => observeDimension(node));
    expect(observedDimension.value).toBe(0);

    const height = 120;
    vi.spyOn(node, 'getBoundingClientRect')
      .mockReturnValueOnce(getDomRect(0, 0, height));
    resize(node);

    expect(await waitForEmission(observedDimension, 2)).toBe(height);

    component.destroy();
  });

  it('should observe bottom changes of the node', async () => {
    const node = document.createElement('div');
    const { observeDimension, observedDimension } = useDimensionObserver(
      'bottom',
    );

    const component = await renderStore(() => observeDimension(node));
    expect(observedDimension.value).toBe(0);

    const bottom = 150;
    vi.spyOn(node, 'getBoundingClientRect')
      .mockReturnValueOnce({ ...getDomRect(0, 0, 100), bottom });
    resize(node);

    expect(await waitForEmission(observedDimension, 2)).toBe(bottom);

    component.destroy();
  });

  it('should not read the node size on DOM mutations', async () => {
    const node = document.createElement('div');
    const { observeDimension } = useDimensionObserver('width');

    const component = await renderStore(() => observeDimension(node));
    const rectSpy = vi.spyOn(node, 'getBoundingClientRect');

    node.setAttribute('style', 'width: 100px');
    node.appendChild(document.createElement('span'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(rectSpy).not.toHaveBeenCalled();

    component.destroy();
  });

  it('should cleanup observer on destroy', async () => {
    const node = document.createElement('div');
    const { observeDimension } = useDimensionObserver('width');

    const component = await renderStore(() => observeDimension(node));
    component.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should cleanup height observer on destroy', async () => {
    const node = document.createElement('div');
    const { observeDimension } = useDimensionObserver('height');

    const component = await renderStore(() => observeDimension(node));
    component.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
