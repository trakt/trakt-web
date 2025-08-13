import { beforeEach, describe, expect, it } from 'vitest';
import { positionAroundTarget } from './positionAroundTarget.ts';

describe('positionAroundTarget', () => {
  let node: HTMLElement;
  let targetNode: HTMLElement;

  function createDomRect(
    left: number,
    top: number,
    width: number,
    height: number,
  ): DOMRect {
    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => {},
    };
  }

  beforeEach(() => {
    node = document.createElement('div');
    targetNode = document.createElement('div');

    Object.defineProperty(node, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 200,
    });
  });

  it('should position popup to the right of the target', () => {
    const targetRect = createDomRect(100, 50, 80, 40);
    const viewport = { left: 0, top: 0, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'right' },
      viewport,
    });

    expect(node.style.left).toBe('180px');
    expect(node.style.top).toBe('50px');

    expect(node).toHaveAttribute('data-popup-position', 'right');
    expect(targetNode).toHaveAttribute('data-popup-position', 'right');
  });

  it('should position popup to the left of the target', () => {
    const targetRect = createDomRect(300, 50, 80, 40);
    const viewport = { left: 0, top: 0, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'left' },
      viewport,
    });

    expect(node.style.right).toBe('1620px');
    expect(node.style.top).toBe('50px');

    expect(node).toHaveAttribute('data-popup-position', 'left');
    expect(targetNode).toHaveAttribute('data-popup-position', 'left');
  });

  it('should position popup below the target', () => {
    const targetRect = createDomRect(100, 50, 80, 40);
    const viewport = { left: 0, top: 0, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'bottom' },
      viewport,
    });

    expect(node.style.left).toBe('40px');
    expect(node.style.top).toBe('90px');

    expect(node).toHaveAttribute('data-popup-position', 'bottom');
    expect(targetNode).toHaveAttribute('data-popup-position', 'bottom');
  });

  it('should position popup above the target', () => {
    const targetRect = createDomRect(100, 200, 80, 40);
    const viewport = { left: 0, top: 0, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'top' },
      viewport,
    });

    expect(node.style.left).toBe('40px');
    expect(node.style.bottom).toBe('880px');

    expect(node).toHaveAttribute('data-popup-position', 'top');
    expect(targetNode).toHaveAttribute('data-popup-position', 'top');
  });

  it('should handle contain mode', () => {
    const targetRect = createDomRect(100, 50, 80, 40);
    const viewport = { left: 0, top: 0, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'right', mode: 'contain' },
      viewport,
    });

    expect(node.style.left).toBe('100px');
    expect(node.style.top).toBe('50px');
  });

  it('should handle viewport offset', () => {
    const targetRect = createDomRect(100, 50, 80, 40);
    const viewport = { left: 20, top: 30, width: 1920, height: 1080 };

    positionAroundTarget(node, {
      targetRect,
      targetNode,
      placement: { position: 'right' },
      viewport,
    });

    expect(node.style.left).toBe('200px');
    expect(node.style.top).toBe('80px');
  });
});
