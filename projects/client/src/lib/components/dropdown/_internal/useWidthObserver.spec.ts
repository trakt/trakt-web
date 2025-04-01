import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { get } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';
import { useWidthObserver } from './useWidthObserver.ts';

describe('useWidthObserver', () => {
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
    const { observeWidth, observedWidth } = useWidthObserver();

    const component = await renderStore(() => observeWidth(node));
    expect(get(observedWidth)).toBe(0);

    const width = 100;
    vi.spyOn(node, 'getBoundingClientRect')
      .mockReturnValueOnce(getDomRect(0, 0, width));
    node.setAttribute('style', `width: ${width}px`);

    expect(await waitForEmission(observedWidth, 2)).toBe(width);

    component.destroy();
  });

  it('should cleanup observer on destroy', async () => {
    const node = document.createElement('div');
    const { observeWidth } = useWidthObserver();
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

    const component = await renderStore(() => observeWidth(node));
    component.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
