import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isPageFilling } from './isPageFilling.ts';

describe('isPageFilling', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.window, 'innerHeight', 'get')
      .mockReturnValue(800);

    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(200);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when height is greater than available height', () => {
    expect(isPageFilling(1001)).toBe(true);
  });

  it('should return false when height is equal to available height', () => {
    expect(isPageFilling(1000)).toBe(false);
  });

  it('should return false when height is less than available height', () => {
    expect(isPageFilling(999)).toBe(false);
  });

  it('should return true when height is greater than container height', () => {
    const container = { clientHeight: 500 } as HTMLElement;
    expect(isPageFilling(501, container)).toBe(true);
  });

  it('should return false when height is equal to container height', () => {
    const container = { clientHeight: 500 } as HTMLElement;
    expect(isPageFilling(500, container)).toBe(false);
  });

  it('should return false when height is less than container height', () => {
    const container = { clientHeight: 500 } as HTMLElement;
    expect(isPageFilling(499, container)).toBe(false);
  });
});
