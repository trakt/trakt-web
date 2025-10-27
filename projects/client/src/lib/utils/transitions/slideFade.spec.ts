import { describe, expect, it } from 'vitest';

import { slideFade, splitTransition } from './slideFade.ts';

describe('transition: slideFade', () => {
  it('starts both transitions at 0', () => {
    expect(splitTransition(0)).toEqual([0, 0]);
  });

  it('completes the first one half-way', () => {
    expect(splitTransition(0.5)).toEqual([1, 0]);
  });

  it('ends both transitions at 1', () => {
    expect(splitTransition(1)).toEqual([1, 1]);
  });

  it('transitions the width correctly', () => {
    const node = { style: { opacity: '1' } } as unknown as Element;

    globalThis.getComputedStyle = () => ({
      opacity: '1',
      width: '100',
      height: '50',
    } as CSSStyleDeclaration);

    const transition = slideFade(node, { axis: 'x' });

    expect(transition.css(0)).toContain('width: 0px;');
    expect(transition.css(0)).toContain('opacity: 0;');
    expect(transition.css(0.5)).toContain('width: 100px;');
    expect(transition.css(0.5)).toContain('opacity: 0;');
    expect(transition.css(1)).toContain('width: 100px;');
    expect(transition.css(1)).toContain('opacity: 1;');
  });

  it('transitions the height correctly', () => {
    const node = { style: { opacity: '1' } } as unknown as Element;

    globalThis.getComputedStyle = () => ({
      opacity: '1',
      width: '100',
      height: '50',
    } as CSSStyleDeclaration);

    const transition = slideFade(node, { axis: 'y' });

    expect(transition.css(0)).toContain('height: 0px;');
    expect(transition.css(0)).toContain('opacity: 0;');
    expect(transition.css(0.5)).toContain('height: 50px;');
    expect(transition.css(0.5)).toContain('opacity: 0;');
    expect(transition.css(1)).toContain('height: 50px;');
    expect(transition.css(1)).toContain('opacity: 1;');
  });
});
