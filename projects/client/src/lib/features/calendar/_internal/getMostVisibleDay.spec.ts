import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CalendarEntry } from '../models/CalendarEntry.ts';
import { dateKey } from './dateKey.ts';
import { getMostVisibleDay } from './getMostVisibleDay.ts';

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

function createCalendarEntry(date: Date): CalendarEntry {
  return {
    date,
    items: [],
  };
}

describe('getMostVisibleDay', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis.window, 'innerHeight', {
      value: 1000,
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('will return null when no calendar entries exist', () => {
    const calendar: CalendarEntry[] = [];

    expect(getMostVisibleDay(calendar, 0)).toBeNull();
  });

  it('will return null when no elements are found in DOM', () => {
    const calendar = [
      createCalendarEntry(new Date('2023-12-20')),
      createCalendarEntry(new Date('2023-12-21')),
    ];

    expect(getMostVisibleDay(calendar, 0)).toBeNull();
  });

  it('will return the most visible day', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(100, 300, 200);
    const element2 = createMockElement(900, 1100, 200);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 0)).toEqual(date1);
  });

  it('will handle partially visible elements at top', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(-50, 150, 200);
    const element2 = createMockElement(200, 400, 200);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 0)).toEqual(date2);
  });

  it('will handle offset correctly', () => {
    const date1 = new Date('2023-12-20');

    const calendar = [createCalendarEntry(date1)];

    const element1 = createMockElement(50, 250, 200);
    element1.id = dateKey(date1);
    document.body.appendChild(element1);

    expect(getMostVisibleDay(calendar, 100)).toEqual(date1);
  });

  it('will handle elements with zero height', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(100, 100, 0);
    const element2 = createMockElement(200, 400, 200);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 0)).toEqual(date2);
  });

  it('will handle elements completely outside viewport', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(-200, -100, 100);
    const element2 = createMockElement(1100, 1200, 100);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 0)).toBeNull();
  });

  it('will handle offset reducing element visibility', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(50, 250, 200);
    const element2 = createMockElement(200, 400, 200);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 150)).toEqual(date2);
  });

  it('will handle offset making elements invisible', () => {
    const date1 = new Date('2023-12-20');
    const date2 = new Date('2023-12-21');

    const calendar = [
      createCalendarEntry(date1),
      createCalendarEntry(date2),
    ];

    const element1 = createMockElement(50, 150, 100);
    const element2 = createMockElement(300, 500, 200);

    element1.id = dateKey(date1);
    element2.id = dateKey(date2);

    document.body.appendChild(element1);
    document.body.appendChild(element2);

    expect(getMostVisibleDay(calendar, 200)).toEqual(date2);
  });
});
