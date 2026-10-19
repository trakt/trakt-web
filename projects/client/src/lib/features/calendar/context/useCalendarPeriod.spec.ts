import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addWeeks } from 'date-fns/addWeeks';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
  anchor,
  active = anchor,
  visible = null,
}: {
  anchor: Date;
  active?: Date;
  visible?: Date | null;
}): CalendarContext => ({
  range: new BehaviorSubject({ anchor, earlier: 0, later: 0 }),
  activeDate: new BehaviorSubject(active),
  visibleDate: new BehaviorSubject<Date | null>(visible),
});

const chunkStarts = async (period: ReturnType<typeof useCalendarPeriod>) =>
  (await firstValueFrom(period.chunks)).map((chunk) =>
    chunk.start.toDateString(),
  );

describe('store: useCalendarPeriod', () => {
  beforeEach(() => {
    track.mockClear();
  });

  describe('upperBound', () => {
    it('should move an anchor past the bound back to today', async () => {
      const today = new Date();
      const ctx = createContext({ anchor: addWeeks(today, 3) });
      context.current = ctx;
      const period = useCalendarPeriod({
        upperBound: getStartOfWeek(today, 'en'),
      });

      expect(await chunkStarts(period)).toEqual([
        getStartOfWeek(today, 'en').toDateString(),
      ]);
      expect(ctx.activeDate.value.toDateString()).toEqual(today.toDateString());
      expect(ctx.range.value.anchor.toDateString()).toEqual(
        today.toDateString(),
      );
    });
  });

  describe('goTo', () => {
    it('should open a new window at the given date', async () => {
      const ctx = createContext({
        anchor: new Date(2026, 9, 12),
        visible: new Date(2026, 9, 14),
      });
      context.current = ctx;
      const period = useCalendarPeriod();

      period.loadMore();
      period.goTo(new Date(2026, 10, 19), 'next');

      expect(await chunkStarts(period)).toEqual(['Sun Nov 15 2026']);
      expect(ctx.activeDate.value).toEqual(new Date(2026, 10, 19));
      expect(ctx.visibleDate.value).toBeNull();
      expect(track).toHaveBeenCalledWith({ action: 'next' });
    });
  });

  describe('next and previous', () => {
    it('should move a week from the visible date', async () => {
      const ctx = createContext({
        anchor: new Date(2026, 9, 12),
        visible: new Date(2026, 9, 21),
      });
      context.current = ctx;
      const period = useCalendarPeriod();

      period.next();

      expect(await chunkStarts(period)).toEqual(['Sun Oct 25 2026']);
      expect(ctx.activeDate.value).toEqual(new Date(2026, 9, 25));
      expect(track).toHaveBeenCalledWith({ action: 'next' });
    });

    it('should activate the last day of the week for reverse lists', () => {
      const ctx = createContext({ anchor: new Date(2026, 9, 12) });
      context.current = ctx;

      useCalendarPeriod({ order: 'reverse-chronological' }).previous();

      expect(ctx.activeDate.value).toEqual(new Date(2026, 9, 10));
    });
  });

  describe('loadMore and loadPrevious', () => {
    it('should grow the window in both directions', async () => {
      context.current = createContext({ anchor: new Date(2026, 9, 12) });
      const period = useCalendarPeriod();

      period.loadMore();
      period.loadPrevious();

      expect(await chunkStarts(period)).toEqual([
        'Sun Oct 04 2026',
        'Sun Oct 11 2026',
        'Sun Oct 18 2026',
      ]);
    });

    it('should stop loading newer chunks at the upper bound', async () => {
      context.current = createContext({ anchor: new Date(2026, 8, 9) });
      const period = useCalendarPeriod({
        order: 'reverse-chronological',
        weeksPerStep: 2,
        upperBound: new Date(2026, 8, 20),
      });

      expect(await chunkStarts(period)).toEqual(['Sun Aug 30 2026']);

      expect(period.loadMore()).toBe(true);
      expect(period.loadPrevious()).toBe(true);
      expect(period.loadPrevious()).toBe(false);

      expect(await chunkStarts(period)).toEqual([
        'Sun Aug 16 2026',
        'Sun Aug 30 2026',
        'Sun Sep 13 2026',
      ]);
    });
  });

  describe('reset', () => {
    it('should keep the window when already in the current week', async () => {
      const today = new Date();
      const ctx = createContext({ anchor: today, visible: today });
      context.current = ctx;
      const period = useCalendarPeriod();

      period.loadMore();
      period.reset();

      expect(await chunkStarts(period)).toHaveLength(2);
      expect(ctx.visibleDate.value).toBeNull();
      expect(track).toHaveBeenCalledWith({ action: 'reset' });
    });

    it('should open a window at today from another week', async () => {
      context.current = createContext({ anchor: new Date(2020, 0, 8) });
      const period = useCalendarPeriod();

      period.reset();

      expect(await chunkStarts(period)).toEqual([
        getStartOfWeek(new Date(), 'en').toDateString(),
      ]);
    });
  });
});
