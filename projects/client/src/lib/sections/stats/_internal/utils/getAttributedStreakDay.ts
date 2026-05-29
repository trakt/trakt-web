import { STREAK_DAY_BUFFER } from '$lib/sections/stats/_internal/constants/index.ts';

export function getAttributedStreakDay(date: Date): Date {
  const shifted = new Date(date.getTime() - STREAK_DAY_BUFFER);
  return new Date(shifted.getFullYear(), shifted.getMonth(), shifted.getDate());
}
