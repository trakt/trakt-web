import { afterEach, describe, expect, it, vi } from 'vitest';
import { dropIn } from './dropIn.ts';

type FakeNode = {
  style: Record<string, string>;
  parentElement: FakeNode | null;
};

function fakeNode(
  size: { width: number; height: number },
  rowGap = 0,
): Element {
  const parent: FakeNode = {
    style: { rowGap: rowGap ? `${rowGap}px` : 'normal' },
    parentElement: null,
  };
  const node: FakeNode = {
    style: { width: `${size.width}px`, height: `${size.height}px` },
    parentElement: parent,
  };

  return node as unknown as Element;
}

describe('transition: dropIn', () => {
  vi.stubGlobal('getComputedStyle', (node: FakeNode) => node.style);

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal('getComputedStyle', (node: FakeNode) => node.style);
  });

  it('should start collapsed, lifted and invisible on the y axis', () => {
    const transition = dropIn(fakeNode({ width: 300, height: 64 }));

    expect(transition.css?.(0, 1)).toBe(
      'max-height: 0px;margin-bottom: 0px;overflow: hidden;opacity: 0;transform: translateY(-16px);',
    );
  });

  it('should rest at full size with no offset', () => {
    const transition = dropIn(fakeNode({ width: 300, height: 64 }));

    expect(transition.css?.(1, 0)).toBe(
      'max-height: 64px;margin-bottom: 0px;overflow: hidden;opacity: 1;transform: translateY(0px);',
    );
  });

  it('should compensate the parent row gap while collapsed', () => {
    const transition = dropIn(fakeNode({ width: 300, height: 64 }, 12));

    expect(transition.css?.(0, 1)).toContain('margin-bottom: -12px;');
    expect(transition.css?.(1, 0)).toContain('margin-bottom: 0px;');
  });

  it('should collapse the width instead on the x axis', () => {
    const transition = dropIn(fakeNode({ width: 126, height: 32 }, 12), {
      axis: 'x',
      offset: 24,
    });

    expect(transition.css?.(0.5, 0.5)).toBe(
      'max-width: 63px;margin-bottom: 0px;overflow: hidden;opacity: 0.5;transform: translateY(-12px);',
    );
  });

  it('should keep the default duration', () => {
    expect(dropIn(fakeNode({ width: 10, height: 10 })).duration).toBe(240);
  });
});
