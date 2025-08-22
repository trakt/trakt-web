import { beforeEach, describe, expect, it, vi } from 'vitest';
import { forceOnScreen } from './forceOnScreen.ts';

describe('forceOnScreen', () => {
  let popupContainer: HTMLElement;
  let targetNode: HTMLElement;

  function createDomRect(left: number, right: number, width: number): DOMRect {
    return {
      left,
      right,
      width,
      x: left,
      y: 0,
      top: 0,
      bottom: 100,
      height: 100,
      toJSON: () => {},
    };
  }

  beforeEach(() => {
    popupContainer = document.createElement('div');
    targetNode = document.createElement('div');

    Object.defineProperty(globalThis.window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
  });

  it('should account for left overflow', () => {
    const popupRect = createDomRect(-50, 150, 200);
    vi.spyOn(popupContainer, 'getBoundingClientRect').mockReturnValue(
      popupRect,
    );

    forceOnScreen(popupContainer, targetNode, 'top');

    expect(popupContainer.style.left).toBe('0px');
    expect(popupContainer.style.right).toBe('initial');

    expect(popupContainer).toHaveAttribute('data-popup-position', 'top');
    expect(targetNode).toHaveAttribute('data-popup-position', 'top');

    expect(popupContainer).toHaveAttribute('data-popup-alignment', 'unaligned');
    expect(targetNode).toHaveAttribute('data-popup-alignment', 'unaligned');
  });

  it('should account for right overflow', () => {
    const popupRect = createDomRect(1800, 2000, 200);
    vi.spyOn(popupContainer, 'getBoundingClientRect').mockReturnValue(
      popupRect,
    );

    forceOnScreen(popupContainer, targetNode, 'bottom');

    const expectedLeft = globalThis.window.innerWidth - popupRect.width;

    expect(popupContainer.style.left).toBe(`${expectedLeft}px`);
    expect(popupContainer.style.right).toBe('initial');

    expect(popupContainer).toHaveAttribute('data-popup-position', 'bottom');
    expect(targetNode).toHaveAttribute('data-popup-position', 'bottom');

    expect(popupContainer).toHaveAttribute('data-popup-alignment', 'unaligned');
    expect(targetNode).toHaveAttribute('data-popup-alignment', 'unaligned');
  });
});
