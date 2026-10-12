import { time } from '$lib/utils/timing/time.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeSeasonalThemes } from './initializeSeasonalThemes.ts';

const readSeason = () =>
  document.documentElement.getAttribute('data-seasonal-theme');

describe('initializeSeasonalThemes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 0, 1, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute('data-seasonal-theme');
  });

  it('should activate the season that is running on load', () => {
    initializeSeasonalThemes();

    expect(readSeason()).toBe('new-year');
  });

  it('should activate next year seasons without a reload', () => {
    initializeSeasonalThemes();

    vi.advanceTimersByTime(
      new Date(2027, 11, 31, 12).getTime() - new Date(2027, 0, 1, 12).getTime(),
    );

    expect(readSeason()).toBe('new-year');
  });

  it('should clear the season between windows', () => {
    initializeSeasonalThemes();

    vi.advanceTimersByTime(time.days(30));

    expect(readSeason()).toBeNull();
  });
});
