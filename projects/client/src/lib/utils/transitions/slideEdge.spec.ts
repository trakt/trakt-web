import { describe, expect, it } from 'vitest';

import { slideEdge } from './slideEdge.ts';

describe('transition: slideEdge', () => {
  const node = {} as Element;

  it('should slide in from the bottom edge on the y axis', () => {
    const transition = slideEdge(node, { axis: 'y' });

    expect(transition.css?.(0, 1)).toBe('transform: translateY(100%);');
    expect(transition.css?.(1, 0)).toBe('transform: translateY(0%);');
  });

  it('should only animate transform on the y axis', () => {
    const transition = slideEdge(node, { axis: 'y' });

    expect(transition.css?.(0.5, 0.5)).not.toMatch(/height|padding|margin/);
  });

  it('should slide in along the inline axis on the x axis', () => {
    const transition = slideEdge(node, { axis: 'x' });

    expect(transition.css?.(0, 1)).toBe(
      'transform: translateX(calc(var(--rtl-sign, 1) * 100%));',
    );
  });

  it('should keep the default duration', () => {
    expect(slideEdge(node).duration).toBe(150);
  });
});
