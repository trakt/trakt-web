import type { CalendarEntry } from '../models/CalendarEntry.ts';
import { dateKey } from './dateKey.ts';

function getElementVisibility(element: HTMLElement, offset: number) {
  const rect = element.getBoundingClientRect();

  const visibleTop = Math.max(rect.top, offset);
  const visibleBottom = Math.min(rect.bottom, globalThis.window.innerHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return rect.height === 0 ? 0 : visibleHeight / rect.height;
}

export function getMostVisibleDay(calendar: CalendarEntry[], offset: number) {
  return calendar.reduce<{ date: Date | null; maxVisibility: number }>(
    (acc, day) => {
      const element = document.getElementById(dateKey(day.date));
      if (!element) {
        return acc;
      }

      const visibility = getElementVisibility(element, offset);
      if (visibility > acc.maxVisibility) {
        return { date: day.date, maxVisibility: visibility };
      }

      return acc;
    },
    { date: null, maxVisibility: 0 },
  ).date;
}
