import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import type {
  AwardTimeline,
  AwardTimelineMilestone,
  AwardTimelineTick,
  AwardTimelineYear,
} from './models/AwardTimeline.ts';

type ToAwardTimelineProps = {
  entries: ReadonlyArray<AwardEntry>;
  careerStart: number | Nil;
  today: Date;
};

const AXIS_INSET = 4;
const AXIS_SPAN = 92;
const EDGE_GAP = 0.1;
const MILESTONE_LIMIT = 2;
const TICK_CLEARANCE = 5;

function toAlign(x: number): AwardTimelineMilestone['align'] {
  if (x > 70) return 'end';
  if (x < 30) return 'start';
  return 'middle';
}

const byWinFirst = (a: AwardEntry, b: AwardEntry) =>
  Number(b.won === true) - Number(a.won === true);

function toYears(
  entries: ReadonlyArray<AwardEntry>,
  toX: (year: number) => number,
): AwardTimelineYear[] {
  const years = [...new Set(entries.map((entry) => entry.year))].sort(
    (a, b) => a - b,
  );

  return years.map((year) => {
    const yearEntries = entries
      .filter((entry) => entry.year === year)
      .sort(byWinFirst);

    return {
      key: `year-${year}`,
      year,
      x: toX(year),
      isWon: yearEntries.some((entry) => entry.won === true),
      entries: yearEntries,
    };
  });
}

function toDecades(start: number, end: number, range: number) {
  const first = Math.ceil(start / 10);
  const last = Math.floor(end / 10);

  return Array.from(
    { length: Math.max(last - first + 1, 0) },
    (_, index) => (first + index) * 10,
  ).filter(
    (decade) =>
      (decade - start) / range > EDGE_GAP && (end - decade) / range > EDGE_GAP,
  );
}

export function toAwardTimeline({
  entries,
  careerStart,
  today,
}: ToAwardTimelineProps): AwardTimeline {
  const entryYears = entries.map((entry) => entry.year);
  const nowYear = today.getFullYear();
  const start = Math.min(careerStart ?? nowYear, ...entryYears);
  const end = Math.max(nowYear, ...entryYears);
  const range = Math.max(end - start, 1);
  const toX = (year: number) =>
    AXIS_INSET + ((year - start) / range) * AXIS_SPAN;

  const chronological = [...entries].sort((a, b) => a.year - b.year);
  const isMilestones = entries.length <= MILESTONE_LIMIT;
  const milestones = isMilestones
    ? chronological.map((entry, index) => {
        const x = toX(entry.year);
        return { entry, x, align: toAlign(x), isBelow: index > 0 };
      })
    : [];
  const belowX = milestones.find((milestone) => milestone.isBelow)?.x;

  const ticks: AwardTimelineTick[] = [
    start,
    ...toDecades(start, end, range),
    end,
  ]
    .map((year) => ({
      key: `tick-${year}`,
      year,
      x: toX(year),
      isNow: year === end && end === nowYear,
    }))
    .filter(
      (tick) => belowX == null || Math.abs(tick.x - belowX) > TICK_CLEARANCE,
    )
    .filter(
      (tick, index, all) =>
        all.findIndex((t) => t.year === tick.year) === index,
    );

  const years = toYears(entries, toX);

  const winLabels = isMilestones
    ? []
    : years
        .filter((year) => year.isWon)
        .map((year, index) => ({
          key: `win-${year.year}`,
          year: year.year,
          x: year.x,
          isLow: index % 2 === 1,
        }));

  return { start, ticks, years, milestones, winLabels };
}
