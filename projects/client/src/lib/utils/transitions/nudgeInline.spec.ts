import { describe, expect, it } from 'vitest';
import { nudgeInline } from './nudgeInline.ts';

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

  globalThis.getComputedStyle = ((target: Element) =>
    target === parent
      ? { columnGap: gap }
      : { marginInlineEnd: margin }) as unknown as typeof getComputedStyle;

  return element;
};

describe('transition: nudgeInline', () => {
  it('should start with its width and the gap after it pulled in', () => {
    const transition = nudgeInline(node({ width: 28, gap: '4px' }));

    expect(transition.css?.(0, 1)).toBe(
      'margin-inline-end: -32px; opacity: 0;',
    );
    expect(transition.css?.(0.5, 0.5)).toBe(
      'margin-inline-end: -16px; opacity: 0.5;',
    );
    expect(transition.css?.(1, 0)).toBe('margin-inline-end: 0px; opacity: 1;');
  });

  it('should settle on the margin the item already has', () => {
    const transition = nudgeInline(
      node({ width: 28, gap: '4px', margin: '6px' }),
    );

    expect(transition.css?.(1, 0)).toBe('margin-inline-end: 6px; opacity: 1;');
    expect(transition.css?.(0, 1)).toBe(
      'margin-inline-end: -32px; opacity: 0;',
    );
  });
});
