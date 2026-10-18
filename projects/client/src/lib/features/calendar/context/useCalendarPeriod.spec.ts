import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CalendarContext } from './CalendarContext.ts';
import { useCalendarPeriod } from './useCalendarPeriod.ts';

const { context, track } = vi.hoisted(() => ({
  context: { current: null as unknown },
  track: vi.fn(),
}));

vi.mock('./getCalendarContext.ts', () => ({
  getCalendarContext: () => context.current,
}));
vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));
vi.mock('$lib/features/i18n/index.ts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getLocale: () => 'en',
}));

const createContext = ({
  start,
  active,
  visible = null,
}: {
  start: Date;
  active: Date;
  visible?: Date | null;
}): CalendarContext => ({
  startDate: new BehaviorSubject(start),
  activeDate: new BehaviorSubject(active),
  visibleDate: new BehaviorSubject<Date | null>(visible),
});

describe('store: useCalendarPeriod', () => {
  beforeEach(() => {
    track.mockClear();
  });

  describe('goTo', () => {
    it('should jump to the week of the given date', () => {
      const ctx = createContext({
        start: new Date(2026, 9, 11),
        active: new Date(2026, 9, 12),
        visible: new Date(2026, 9, 14),
      });
      context.current = ctx;

      useCalendarPeriod().goTo(new Date(2026, 10, 19), 'next');

      expect(ctx.startDate.value).toEqual(new Date(2026, 10, 15));
      expect(ctx.activeDate.value).toEqual(new Date(2026, 10, 19));
      expect(ctx.visibleDate.value).toBeNull();
      expect(track).toHaveBeenCalledWith({ action: 'next' });
    });
  });

  describe('restart', () => {
    it('should restart from the week of the visible date', () => {
      const ctx = createContext({
        start: new Date(2026, 9, 4),
        active: new Date(2026, 9, 5),
        visible: new Date(2026, 9, 21),
      });
      context.current = ctx;

      useCalendarPeriod().restart();

      expect(ctx.startDate.value).toEqual(new Date(2026, 9, 18));
      expect(ctx.activeDate.value).toEqual(new Date(2026, 9, 21));
      expect(ctx.visibleDate.value).toBeNull();
      expect(track).not.toHaveBeenCalled();
    });

    it('should fall back to the active date without a visible date', () => {
      const ctx = createContext({
        start: new Date(2026, 9, 4),
        active: new Date(2026, 9, 14),
      });
      context.current = ctx;

      useCalendarPeriod().restart();

      expect(ctx.startDate.value).toEqual(new Date(2026, 9, 11));
      expect(ctx.activeDate.value).toEqual(new Date(2026, 9, 14));
    });
  });

  describe('reset', () => {
    it('should clear the visible date when already in the current week', () => {
      const today = new Date();
      const ctx = createContext({
        start: today,
        active: today,
        visible: today,
      });
      context.current = ctx;

      useCalendarPeriod().reset();

      expect(ctx.visibleDate.value).toBeNull();
      expect(track).toHaveBeenCalledWith({ action: 'reset' });
    });
  });
});
