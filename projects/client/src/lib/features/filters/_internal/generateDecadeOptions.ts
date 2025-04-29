import type { FilterOption } from '$lib/features/filters/models/Filter.ts';

const START_YEAR = 1960;
const DECADE_YEARS = 10;

export function generateDecadeOptions(): FilterOption[] {
  const currentYear = new Date().getFullYear();
  const numDecades = Math.floor((currentYear - START_YEAR) / DECADE_YEARS) + 1;

  return Array.from({ length: numDecades }, (_, index) => {
    const decadeStart = START_YEAR + index * DECADE_YEARS;
    const decadeEnd = decadeStart + DECADE_YEARS - 1;

    return {
      label: `${decadeStart}`,
      value: `${decadeStart}-${decadeEnd}`,
    };
  }).reverse();
}
