import type { WeekData } from '$lib/sections/stats/_internal/models/WeekData.ts';

export function buildWeekData(overrides: Partial<WeekData> = {}): WeekData {
  return {
    movieDates: [],
    showDates: [],
    uniqueShows: 0,
    ratings: [],
    totalMinutes: 0,
    movieMinutes: 0,
    showMinutes: 0,
    dailyMinutes: [0, 0, 0, 0, 0, 0, 0],
    ...overrides,
  };
}
