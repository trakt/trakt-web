import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import type { AwardDecade } from './models/AwardDecade.ts';

function toDecade(year: number) {
  return Math.floor(year / 10) * 10;
}

export function toAwardDecades(
  entries: ReadonlyArray<AwardEntry>,
): AwardDecade[] {
  const sorted = [...entries].sort((a, b) => b.year - a.year);
  const decades = [...new Set(sorted.map((entry) => toDecade(entry.year)))];

  return decades.map((decade) => {
    const items = sorted.filter((entry) => toDecade(entry.year) === decade);
    return {
      key: `decade-${decade}`,
      decade,
      entries: items,
      wins: items.filter((entry) => entry.won === true).length,
    };
  });
}
