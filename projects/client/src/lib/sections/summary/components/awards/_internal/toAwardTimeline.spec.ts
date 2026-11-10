import { PersonGiamattiAwardsMappedMock } from '$mocks/data/awards/mapped/PersonGiamattiAwardsMappedMock.ts';
import { PersonStreepAwardsMappedMock } from '$mocks/data/awards/mapped/PersonStreepAwardsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toAwardTimeline } from './toAwardTimeline.ts';

const TODAY = new Date('2026-11-10T00:00');

describe('util: toAwardTimeline', () => {
  it('should span from the first credit to now', () => {
    const timeline = toAwardTimeline({
      entries: PersonStreepAwardsMappedMock,
      careerStart: 1977,
      today: TODAY,
    });

    expect(timeline.start).to.equal(1977);
    expect(timeline.ticks.at(0)).to.include({ year: 1977, x: 4 });
    expect(timeline.ticks.at(-1)).to.include({
      year: 2026,
      x: 96,
      isNow: true,
    });
    expect(timeline.ticks.map((tick) => tick.year)).to.deep.equal([
      1977, 1990, 2000, 2010, 2020, 2026,
    ]);
  });

  it('should fall back to the first award year', () => {
    const timeline = toAwardTimeline({
      entries: PersonStreepAwardsMappedMock,
      careerStart: undefined,
      today: TODAY,
    });

    expect(timeline.start).to.equal(1979);
  });

  it('should stay finite without awards or credits', () => {
    const timeline = toAwardTimeline({
      entries: [],
      careerStart: undefined,
      today: TODAY,
    });

    expect(timeline.start).to.equal(2026);
    expect(timeline.ticks.every((tick) => Number.isFinite(tick.x))).to.equal(
      true,
    );
  });

  it('should merge awards of the same year into one point', () => {
    const timeline = toAwardTimeline({
      entries: PersonStreepAwardsMappedMock,
      careerStart: 1977,
      today: TODAY,
    });

    const years = timeline.years.map((year) => year.year);
    expect(years).to.deep.equal([...new Set(years)].sort((a, b) => a - b));
    expect(
      timeline.years.reduce((total, year) => total + year.entries.length, 0),
    ).to.equal(PersonStreepAwardsMappedMock.length);
    expect(
      timeline.years.find((year) => year.year === 2012)?.entries.at(0)?.won,
    ).to.equal(true);
  });

  it('should label wins alternating', () => {
    const timeline = toAwardTimeline({
      entries: PersonStreepAwardsMappedMock,
      careerStart: 1977,
      today: TODAY,
    });

    expect(timeline.milestones).to.deep.equal([]);
    expect(
      timeline.winLabels.map(({ year, isLow }) => ({ year, isLow })),
    ).to.deep.equal([
      { year: 1980, isLow: false },
      { year: 1983, isLow: true },
      { year: 2012, isLow: false },
    ]);
  });

  it('should use milestones for one or two awards', () => {
    const timeline = toAwardTimeline({
      entries: PersonGiamattiAwardsMappedMock,
      careerStart: 1992,
      today: TODAY,
    });

    expect(
      timeline.milestones.map(({ entry, align, isBelow }) => ({
        year: entry.year,
        align,
        isBelow,
      })),
    ).to.deep.equal([
      { year: 2006, align: 'middle', isBelow: false },
      { year: 2024, align: 'end', isBelow: true },
    ]);
    expect(timeline.winLabels).to.deep.equal([]);
  });
});
