type DayFlowEntry = {
  /** Day bucket key, e.g. `2026-06-27`. Entries sharing a key are merged. */
  day: string;
  /** Positive contribution for the day (e.g. items added). */
  added: number;
  /** Negative contribution for the day (e.g. items removed). */
  removed: number;
};

export type NetFlowDay = {
  day: string;
  net: number;
};

/**
 * Collapse signed per-day flow entries into one net value per day
 * (`added - removed`), ascending by day key. Pure: stable output for a given
 * input regardless of entry order.
 */
export function netFlowByDay(
  entries: ReadonlyArray<DayFlowEntry>,
): NetFlowDay[] {
  const byDay = entries.reduce((acc, entry) => {
    const running = acc.get(entry.day) ?? 0;
    acc.set(entry.day, running + entry.added - entry.removed);
    return acc;
  }, new Map<string, number>());

  return [...byDay.entries()]
    .map(([day, net]) => ({ day, net }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
