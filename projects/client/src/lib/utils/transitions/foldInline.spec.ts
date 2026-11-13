import { describe, expect, it } from 'vitest';
import { foldInline } from './foldInline.ts';

type Styles = Partial<
  Record<'columnGap' | 'marginInlineStart' | 'marginInlineEnd', string>
>;

const node = ({
  width,
  gap,
  margin = '0px',
}: {
  width: number;
  gap: string;
  margin?: string;
}) => {
  const parent = {} as HTMLElement;
  const element = {
    offsetWidth: width,
    parentElement: parent,
  } as unknown as HTMLElement;

  globalThis.getComputedStyle = ((target: Element): Styles =>
    target === parent
      ? { columnGap: gap }
      : {
          marginInlineStart: margin,
          marginInlineEnd: margin,
        }) as unknown as typeof getComputedStyle;

  return element;
};

describe('transition: foldInline', () => {
  it('should fold the width and the gap after it away', () => {
    const transition = foldInline(node({ width: 200, gap: '12px' }));

    expect(transition.css?.(0, 1)).toBe(
      'flex: none; min-width: 0; width: 0px; margin-inline-end: -12px; opacity: 0;',
    );
    expect(transition.css?.(1, 0)).toBe(
      'flex: none; min-width: 0; width: 200px; margin-inline-end: 0px; opacity: 1;',
    );
  });

  it('should take the gap before it when folding from the start', () => {
    const transition = foldInline(node({ width: 80, gap: '4px' }), {
      side: 'start',
    });

    expect(transition.css?.(0, 1)).toContain('margin-inline-start: -4px;');
    expect(transition.css?.(0.5, 0.5)).toContain('width: 40px;');
  });

  it('should settle on the margin the item already has', () => {
    const transition = foldInline(
      node({ width: 80, gap: '4px', margin: '6px' }),
      { side: 'start' },
    );

    expect(transition.css?.(1, 0)).toContain('margin-inline-start: 6px;');
    expect(transition.css?.(0, 1)).toContain('margin-inline-start: -4px;');
  });

  it('should fold without a parent gap', () => {
    const element = {
      offsetWidth: 50,
      parentElement: null,
    } as unknown as HTMLElement;
    globalThis.getComputedStyle = (() => ({
      marginInlineEnd: '0px',
    })) as unknown as typeof getComputedStyle;

    expect(foldInline(element).css?.(0, 1)).toContain(
      'margin-inline-end: 0px;',
    );
  });
});
