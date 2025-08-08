import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ActiveDate } from '../context/ActiveDate.ts';
import { dateKey } from './dateKey.ts';
import { scrollToDate } from './scrollToDate.ts';

function createMockElement(
  top: number,
  bottom: number,
  height: number,
): HTMLElement {
  const element = document.createElement('div');

  element.getBoundingClientRect = vi.fn(() => ({
    top,
    bottom,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  }));

  return element;
}

function createActiveDate(
  date: Date,
  source: 'scroll' | 'navigation' | 'init',
): ActiveDate {
  return { date, source };
}

describe('scrollToDate', () => {
  const mockScrollTo = vi.fn();

  beforeEach(() => {
    Object.defineProperty(globalThis.window, 'scrollTo', {
      value: mockScrollTo,
      writable: true,
    });

    Object.defineProperty(globalThis.window, 'scrollY', {
      value: 500,
      writable: true,
    });

    mockScrollTo.mockClear();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('will not scroll when source is scroll', () => {
    const date = new Date('2023-12-20');
    const activeDate = createActiveDate(date, 'scroll');

    scrollToDate(activeDate, 100);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('will not scroll when element is not found', () => {
    const date = new Date('2023-12-20');
    const activeDate = createActiveDate(date, 'navigation');

    scrollToDate(activeDate, 100);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('will scroll to element with offset', () => {
    const date = new Date('2023-12-20');
    const activeDate = createActiveDate(date, 'navigation');

    const element = createMockElement(200, 400, 200);
    element.id = dateKey(date);
    document.body.appendChild(element);

    scrollToDate(activeDate, 100);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 600,
      behavior: 'smooth',
    });
  });

  it('will handle init source', () => {
    const date = new Date('2023-12-20');
    const activeDate = createActiveDate(date, 'init');

    const element = createMockElement(150, 350, 200);
    element.id = dateKey(date);
    document.body.appendChild(element);

    scrollToDate(activeDate, 50);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 600,
      behavior: 'smooth',
    });
  });

  it('will handle zero offset', () => {
    const date = new Date('2023-12-20');
    const activeDate = createActiveDate(date, 'navigation');

    const element = createMockElement(300, 500, 200);
    element.id = dateKey(date);
    document.body.appendChild(element);

    scrollToDate(activeDate, 0);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 800,
      behavior: 'smooth',
    });
  });
});
