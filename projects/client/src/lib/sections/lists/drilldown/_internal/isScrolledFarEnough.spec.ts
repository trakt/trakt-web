import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isScrolledFarEnough,
  LOAD_MORE_AT_SCROLL_PERCENTAGE,
} from './isScrolledFarEnough.ts';

describe('isScrolledFarEnough', () => {
  const SCROLL_HEIGHT = 1000;
  const INNER_HEIGHT = 500;
  const THRESHOLD = (SCROLL_HEIGHT - INNER_HEIGHT) *
    LOAD_MORE_AT_SCROLL_PERCENTAGE;

  beforeEach(() => {
    vi.spyOn(globalThis.window, 'innerHeight', 'get')
      .mockReturnValue(INNER_HEIGHT);

    vi.spyOn(document.documentElement, 'scrollHeight', 'get')
      .mockReturnValue(SCROLL_HEIGHT);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when not scrolled far enough', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(THRESHOLD - 1);

    expect(isScrolledFarEnough()).toBe(false);
  });

  it('should return false when scrolled exactly at threshold', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(THRESHOLD);
    expect(isScrolledFarEnough()).toBe(false);
  });

  it('should return true when scrolled past threshold', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(THRESHOLD + 1);
    expect(isScrolledFarEnough()).toBe(true);
  });
});
