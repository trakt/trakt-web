import { afterEach, describe, expect, it } from 'vitest';

import { collapse } from './collapse.ts';

function mount({ gap, size }: { gap: string; size: number }) {
  const parent = document.createElement('div');
  parent.style.display = 'flex';
  parent.style.flexDirection = 'column';
  parent.style.rowGap = gap;
  parent.style.columnGap = gap;

  const node = document.createElement('div');
  node.getBoundingClientRect = () => ({ height: size, width: size }) as DOMRect;
  parent.appendChild(node);
  document.body.appendChild(parent);
  return node;
}

describe('transition: collapse', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should keep the full size and no pull at the start', () => {
    const node = mount({ gap: '12px', size: 24 });
    const css = collapse(node).css?.(1, 0) ?? '';

    expect(css).toContain('opacity: 1');
    expect(css).toContain('height: 24px');
    expect(css).toContain('margin-block-end: 0px');
  });

  it('should fold the trailing gap away together with the size', () => {
    const node = mount({ gap: '12px', size: 24 });
    const css = collapse(node).css?.(0, 1) ?? '';

    expect(css).toContain('opacity: 0');
    expect(css).toContain('height: 0px');
    expect(css).toContain('margin-block-end: -12px');
  });

  it('should collapse along the inline axis on the x axis', () => {
    const node = mount({ gap: '8px', size: 60 });
    const css = collapse(node, { axis: 'x' }).css?.(0, 1) ?? '';

    expect(css).toContain('width: 0px');
    expect(css).toContain('margin-inline-end: -8px');
  });

  it('should fade the content out before the size has finished shrinking', () => {
    const node = mount({ gap: '0px', size: 100 });
    const css = collapse(node).css?.(0.4, 0.6) ?? '';

    expect(css).toContain('opacity: 0;');
    expect(css).not.toContain('height: 0px');
  });
});
