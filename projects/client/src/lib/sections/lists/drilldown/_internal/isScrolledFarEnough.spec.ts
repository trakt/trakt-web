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

  it('should return true when container is scrolled past threshold', () => {
    const container = {
      scrollHeight: SCROLL_HEIGHT,
      clientHeight: INNER_HEIGHT,
      scrollTop:
        (SCROLL_HEIGHT - INNER_HEIGHT) * LOAD_MORE_AT_SCROLL_PERCENTAGE + 1,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(true);
  });

  it('should return false when container is not scrolled far enough', () => {
    const container = {
      scrollHeight: SCROLL_HEIGHT,
      clientHeight: INNER_HEIGHT,
      scrollTop:
        (SCROLL_HEIGHT - INNER_HEIGHT) * LOAD_MORE_AT_SCROLL_PERCENTAGE - 1,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(false);
  });

  it('should return false when container is scrolled exactly at threshold', () => {
    const container = {
      scrollHeight: SCROLL_HEIGHT,
      clientHeight: INNER_HEIGHT,
      scrollTop: (SCROLL_HEIGHT - INNER_HEIGHT) *
        LOAD_MORE_AT_SCROLL_PERCENTAGE,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(false);
  });
});
