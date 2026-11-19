import { afterEach, describe, expect, it, vi } from 'vitest';

import { collapseOut } from './collapseOut.ts';

function rect({ left, top }: { left: number; top: number }): DOMRect {
  return { left, top, width: 40, height: 24 } as DOMRect;
}

function mount() {
  const parent = document.createElement('div');
  const node = document.createElement('div');
  const next = document.createElement('div');
  parent.append(node, next);
  document.body.appendChild(parent);

  const positions = [rect({ left: 0, top: 36 }), rect({ left: 0, top: 0 })];
  next.getBoundingClientRect = vi.fn(
    () => positions.shift() ?? rect({ left: 0, top: 0 }),
  );
  next.animate = vi.fn() as unknown as HTMLElement['animate'];

  return { node, next };
}

describe('transition: collapseOut', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should take the node out of the flow so the layout settles at once', () => {
    const { node } = mount();

    collapseOut(node);

    expect(node.style.position).toBe('absolute');
  });

  it('should glide the following sibling from where it was with a transform', () => {
    const { node, next } = mount();

    collapseOut(node, { duration: 300 });

    expect(next.animate).toHaveBeenCalledWith(
      [{ transform: 'translate(0px, 36px)' }, { transform: 'none' }],
      expect.objectContaining({ duration: 300 }),
    );
  });

  it('should only animate opacity and transform on the node itself', () => {
    const { node } = mount();
    const css = collapseOut(node).css?.(0.5, 0.5) ?? '';

    expect(css).not.toMatch(/height|width|margin|padding/);
  });

  it('should be fully faded before the siblings finish gliding', () => {
    const { node } = mount();
    const transition = collapseOut(node);

    expect(transition.css?.(1, 0)).toContain('opacity: 1;');
    expect(transition.css?.(0.4, 0.6)).toContain('opacity: 0;');
  });
});
