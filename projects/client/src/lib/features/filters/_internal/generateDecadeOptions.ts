import type { FilterOption } from '$lib/features/filters/models/FilterOptions.ts';
import * as m from '$lib/features/i18n/messages.ts';

const START_YEAR = 1960;
const DECADE_YEARS = 10;

const RANGE_START_YEAR = 1930;
const RANGE_END_YEAR = 2030;

export function generateDecadeRange() {
  return {
    max: RANGE_END_YEAR,
    min: RANGE_START_YEAR,
  };
}

export function generateDecadeOptions(): FilterOption[] {
  const currentYear = new Date().getFullYear();
  const numDecades = Math.floor((currentYear - START_YEAR) / DECADE_YEARS) + 1;

  const decades = Array.from({ length: numDecades }, (_, index) => {
    const decadeStart = START_YEAR + index * DECADE_YEARS;
    const decadeEnd = decadeStart + DECADE_YEARS - 1;

    return {
      label: () => `${decadeStart}`,
      value: `${decadeStart}-${decadeEnd}`,
    };
  }).reverse();

  return [
    {
      label: m.filter_label_this_year,
      value: `${currentYear}`,
    },
    ...decades,
  ];
}
