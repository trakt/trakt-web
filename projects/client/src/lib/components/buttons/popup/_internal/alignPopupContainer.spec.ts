import { beforeEach, describe, expect, it, vi } from 'vitest';
import { alignPopupContainer } from './alignPopupContainer.ts';

describe('alignPopupContainer', () => {
  let popupContainer: HTMLDivElement;

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
  });

  it('should not move it if there is no space to align it', () => {
    popupContainer.style.left = '3px';

    const popupRect = getDomRect(0, 0, 100);
    const targetRect = getDomRect(10, 10, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer(popupContainer, targetRect);

    expect(popupContainer.style.left).toEqual('3px');
    expect(popupContainer).not.toHaveAttribute('data-popup-direction');
  });

  it('should align it left of the target if there is space', () => {
    const popupRect = getDomRect(0, 0, 100);
    const targetRect = getDomRect(500, 500, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer(popupContainer, targetRect);

    expect(popupContainer.style.left).toEqual(
      `${targetRect.right - popupRect.width}px`,
    );
    expect(popupContainer).toHaveAttribute('data-popup-direction', 'left');
  });

  it('should unalign it if there is no space', () => {
    const popupRect = getDomRect(900, 0, 1000);
    const targetRect = getDomRect(900, 500, 50);

    vi.spyOn(popupContainer, 'getBoundingClientRect')
      .mockReturnValueOnce(popupRect);

    alignPopupContainer(popupContainer, targetRect);

    expect(popupContainer).toHaveAttribute('data-popup-direction', 'unaligned');
  });
});
