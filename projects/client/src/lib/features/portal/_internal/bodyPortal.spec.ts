import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bodyPortal } from './bodyPortal.ts';

describe('bodyPortal', () => {
  let node: HTMLDivElement;
  let targetRect: DOMRect;

  beforeEach(() => {
    node = document.createElement('div');
    targetRect = {
      x: 100,
      y: 100,
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      toJSON: () => {},
    };

    // Mock window scroll position
    vi.spyOn(globalThis.window, 'scrollX', 'get').mockReturnValue(10);
    vi.spyOn(globalThis.window, 'scrollY', 'get').mockReturnValue(20);
  });

  it('should set absolute positioning on node', () => {
    bodyPortal(node, targetRect);
    expect(node.style.position).toBe('absolute');
  });

  it('should set correct left position including scroll offset', () => {
    bodyPortal(node, targetRect);
    expect(node.style.left).toBe('110px');
  });

  it('should set correct top position including scroll offset', () => {
    bodyPortal(node, targetRect);
    expect(node.style.top).toBe('120px');
  });

  it('should set z-index to layer-menu variable', () => {
    bodyPortal(node, targetRect);
    expect(node.style.zIndex).toBe('var(--layer-menu)');
  });

  it('should append node to document body', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    bodyPortal(node, targetRect);
    expect(appendChildSpy).toHaveBeenCalledWith(node);
  });
});
