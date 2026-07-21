import { describe, expect, it } from 'vitest';
import { nearestScrollTop } from './nearestScrollTop.ts';

const base = {
  elementHeight: 50,
  marginStart: 0,
  marginEnd: 0,
  scrollTop: 200,
  viewportHeight: 400,
};

describe('nearestScrollTop', () => {
  it('should NOT scroll when the element is already fully visible', () => {
    expect(nearestScrollTop({ ...base, elementTop: 300 })).toBeNull();
  });

  it('should scroll up when the element sits above the viewport', () => {
    expect(nearestScrollTop({ ...base, elementTop: 100 })).toBe(100);
  });

  it('should scroll down when the element sits below the viewport', () => {
    expect(nearestScrollTop({ ...base, elementTop: 700 })).toBe(350);
  });

  it('should offset an upward scroll by the start margin', () => {
    expect(
      nearestScrollTop({ ...base, elementTop: 100, marginStart: 80 }),
    ).toBe(20);
  });

  it('should offset a downward scroll by the end margin', () => {
    expect(nearestScrollTop({ ...base, elementTop: 700, marginEnd: 24 })).toBe(
      374,
    );
  });

  it('should scroll when the start margin pushes a visible element under the header', () => {
    expect(
      nearestScrollTop({ ...base, elementTop: 220, marginStart: 80 }),
    ).toBe(140);
  });

  it('should never return a negative scroll position', () => {
    expect(
      nearestScrollTop({
        ...base,
        elementTop: 0,
        marginStart: 80,
        scrollTop: 40,
      }),
    ).toBe(0);
  });

  it('should treat an element taller than the viewport as an upward scroll', () => {
    expect(
      nearestScrollTop({ ...base, elementTop: 100, elementHeight: 900 }),
    ).toBe(100);
  });
});
