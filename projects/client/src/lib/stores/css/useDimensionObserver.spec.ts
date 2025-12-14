import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { describe, expect, it, vi } from 'vitest';
import { useDimensionObserver } from './useDimensionObserver.ts';

describe('useDimensionObserver', () => {
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
    node.setAttribute('style', `width: ${width}px`);

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
    node.setAttribute('style', `height: ${height}px`);

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
    node.setAttribute('style', `bottom: ${bottom}px`);

    expect(await waitForEmission(observedDimension, 2)).toBe(bottom);

    component.destroy();
  });

  it('should cleanup observer on destroy', async () => {
    const node = document.createElement('div');
    const { observeDimension } = useDimensionObserver('width');
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

    const component = await renderStore(() => observeDimension(node));
    component.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should cleanup height observer on destroy', async () => {
    const node = document.createElement('div');
    const { observeDimension } = useDimensionObserver('height');
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

    const component = await renderStore(() => observeDimension(node));
    component.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
