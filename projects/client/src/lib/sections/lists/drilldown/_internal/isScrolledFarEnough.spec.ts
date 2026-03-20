import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isScrolledFarEnough,
  LOAD_MORE_AT_SCROLL_PERCENTAGE,
} from './isScrolledFarEnough.ts';

describe('isScrolledFarEnough', () => {
  const scrollHeight = 1000;
  const innerHeight = 500;
  const threshold = (scrollHeight - innerHeight) *
    LOAD_MORE_AT_SCROLL_PERCENTAGE;

  beforeEach(() => {
    vi.spyOn(globalThis.window, 'innerHeight', 'get')
      .mockReturnValue(innerHeight);

    vi.spyOn(document.documentElement, 'scrollHeight', 'get')
      .mockReturnValue(scrollHeight);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when not scrolled far enough', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(threshold - 1);

    expect(isScrolledFarEnough()).toBe(false);
  });

  it('should return false when scrolled exactly at threshold', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(threshold);
    expect(isScrolledFarEnough()).toBe(false);
  });

  it('should return true when scrolled past threshold', () => {
    vi.spyOn(globalThis.window, 'scrollY', 'get')
      .mockReturnValue(threshold + 1);
    expect(isScrolledFarEnough()).toBe(true);
  });

  it('should return true when container is scrolled past threshold', () => {
    const container = {
      scrollHeight,
      clientHeight: innerHeight,
      scrollTop: (scrollHeight - innerHeight) * LOAD_MORE_AT_SCROLL_PERCENTAGE +
        1,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(true);
  });

  it('should return false when container is not scrolled far enough', () => {
    const container = {
      scrollHeight,
      clientHeight: innerHeight,
      scrollTop: (scrollHeight - innerHeight) * LOAD_MORE_AT_SCROLL_PERCENTAGE -
        1,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(false);
  });

  it('should return false when container is scrolled exactly at threshold', () => {
    const container = {
      scrollHeight,
      clientHeight: innerHeight,
      scrollTop: (scrollHeight - innerHeight) *
        LOAD_MORE_AT_SCROLL_PERCENTAGE,
    } as HTMLElement;

    expect(isScrolledFarEnough(container)).toBe(false);
  });
});
