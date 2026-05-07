import type { HistorySelection } from '$lib/sections/media-actions/mark-as-watched/_internal/models/HistorySelection.ts';

export function calculateHistorySelection(
  startDate: Date,
  endDate: Date,
): HistorySelection {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const midpoint = new Date((startTime + endTime) / 2);
  const minDate = new Date(Math.min(startTime, endTime));
  const maxDate = new Date(Math.max(startTime, endTime));

  return {
    date: midpoint,
    bounds: {
      minDate,
      maxDate,
    },
  };
}
