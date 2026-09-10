import { describe, expect, it } from 'vitest';
import { getEpisodeWindow } from './getEpisodeWindow.ts';

describe('util: getEpisodeWindow', () => {
  describe('when the season fits the rail', () => {
    it('should show all of it', () => {
      expect(getEpisodeWindow({ total: 4, slots: 5 }))
        .toEqual({ start: 0, end: 4, before: 0, after: 0 });
    });

    it('should hide nothing even when the viewer is deep into it', () => {
      const window = getEpisodeWindow({ total: 4, slots: 5, anchorIndex: 3 });

      expect(window.before).toBe(0);
      expect(window.after).toBe(0);
    });
  });

  describe('when the season is longer than the rail', () => {
    it('should open at the start for a viewer who has not begun', () => {
      expect(getEpisodeWindow({ total: 23, slots: 5 }))
        .toEqual({ start: 0, end: 5, before: 0, after: 18 });
    });

    it('should open on the episode the viewer is up to', () => {
      expect(getEpisodeWindow({ total: 23, slots: 5, anchorIndex: 11 }))
        .toEqual({ start: 11, end: 16, before: 11, after: 7 });
    });

    it('should pull back from the end rather than leave empty slots', () => {
      const window = getEpisodeWindow({ total: 23, slots: 5, anchorIndex: 22 });

      expect(window).toEqual({ start: 18, end: 23, before: 18, after: 0 });
    });

    it('should treat a negative anchor as the start', () => {
      expect(getEpisodeWindow({ total: 23, slots: 5, anchorIndex: -3 }).start)
        .toBe(0);
    });
  });

  describe('when the rail has no room', () => {
    it('should report the whole season as still to come', () => {
      expect(getEpisodeWindow({ total: 23, slots: 0 }))
        .toEqual({ start: 0, end: 0, before: 0, after: 23 });
    });
  });
});
