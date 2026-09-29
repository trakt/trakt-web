import { fireEvent } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pointerWithin } from './pointerWithin.ts';

const rect = { left: 100, right: 200, top: 100, bottom: 300 };

describe('action: pointerWithin', () => {
  let node: HTMLElement;
  let destroy: () => void;
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
    node = document.createElement('div');
    node.getBoundingClientRect = () => rect as DOMRect;
    destroy = pointerWithin(node, { onChange, exitMargin: 10 }).destroy;
  });

  afterEach(() => destroy());

  const move = (x: number, y: number, pointerType = 'mouse') =>
    fireEvent.pointerMove(window, { clientX: x, clientY: y, pointerType });

  it('should report entering and leaving with the mouse', async () => {
    await move(150, 150);
    await move(500, 500);

    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });

  it('should only report a change once', async () => {
    await move(150, 150);
    await move(160, 160);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should keep the mouse inside for a little past the edge', async () => {
    await move(150, 150);
    await move(205, 150);

    expect(onChange).toHaveBeenCalledTimes(1);

    await move(215, 150);

    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('should not enter early because of the margin', async () => {
    await move(95, 150);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should ignore touch', async () => {
    await move(150, 150, 'touch');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should report leaving when the mouse leaves the window', async () => {
    await move(150, 150);
    await fireEvent.pointerOut(window, { relatedTarget: null });

    expect(onChange).toHaveBeenLastCalledWith(false);
  });
});
