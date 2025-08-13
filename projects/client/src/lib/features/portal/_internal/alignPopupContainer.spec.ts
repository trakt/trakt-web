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

  it('should flip left to right if there is no space', () => {
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

  it('should flip right to left if there is no space', () => {
    const popupRect = getDomRect(1500, 0, 600);
    const targetRect = getDomRect(100, 500, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer({
      node: popupContainer,
      targetNode,
      targetRect,
      placement: { position: 'right' },
    });

    expect(targetNode).toHaveAttribute('data-popup-position', 'left');
    expect(popupContainer).toHaveAttribute('data-popup-position', 'left');
  });

  it('should flip top to bottom if there is no space', () => {
    const popupRect = getDomRect(500, -200, 300);
    const targetRect = getDomRect(500, 100, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer({
      node: popupContainer,
      targetNode,
      targetRect,
      placement: { position: 'top' },
    });

    expect(targetNode).toHaveAttribute('data-popup-position', 'bottom');
    expect(popupContainer).toHaveAttribute('data-popup-position', 'bottom');
  });

  it('should flip bottom to top if there is no space', () => {
    const popupRect = getDomRect(500, 900, 300);
    const targetRect = getDomRect(500, 500, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer({
      node: popupContainer,
      targetNode,
      targetRect,
      placement: { position: 'bottom' },
    });

    expect(targetNode).toHaveAttribute('data-popup-position', 'top');
    expect(popupContainer).toHaveAttribute('data-popup-position', 'top');
  });
});
