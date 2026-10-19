import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import type { CalendarWindow } from '../models/CalendarWindow.ts';
import { openCalendarAt } from './openCalendarAt.ts';

describe('openCalendarAt', () => {
  it('should open a fresh range at the given date', () => {
    const date = new Date(2026, 9, 21);
    const context = {
      range: new BehaviorSubject<CalendarWindow>({
        anchor: new Date(2026, 0, 1),
        earlier: 2,
        later: 3,
      }),
      activeDate: new BehaviorSubject(new Date(2026, 0, 1)),
      visibleDate: new BehaviorSubject<Date | null>(new Date(2026, 0, 8)),
    };

    openCalendarAt(context, date);

    expect(context.range.value).toEqual({ anchor: date, earlier: 0, later: 0 });
    expect(context.activeDate.value).toBe(date);
    expect(context.visibleDate.value).toBeNull();
  });
});
