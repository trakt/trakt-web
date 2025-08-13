import { beforeEach, describe, expect, it, vi } from 'vitest';
import { alignPopupContainer } from './alignPopupContainer.ts';

describe('alignPopupContainer', () => {
  let popupContainer: HTMLDivElement;
  let targetNode: HTMLDivElement;

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

  beforeEach(() => {
    popupContainer = document.createElement('div');
    targetNode = document.createElement('div');
  });

  it('should flip it if there is no space', () => {
    const popupRect = getDomRect(900, 0, 1000);
    const targetRect = getDomRect(900, 500, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer({
      node: popupContainer,
      targetNode,
      targetRect,
      placement: { position: 'left' },
    });

    expect(targetNode).toHaveAttribute('data-popup-position', 'right');
    expect(popupContainer).toHaveAttribute('data-popup-position', 'right');
  });
});
