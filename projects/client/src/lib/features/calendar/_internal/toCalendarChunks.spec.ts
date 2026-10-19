import { describe, expect, it } from 'vitest';
import { toCalendarChunks } from './toCalendarChunks.ts';

const toStarts = (chunks: ReadonlyArray<{ start: Date }>) =>
  chunks.map((chunk) => chunk.start.toDateString());

describe('util: toCalendarChunks', () => {
  it('should start at the week of the anchor', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 0, later: 0 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'en',
    });

    expect(toStarts(chunks)).toEqual(['Sun Oct 18 2026']);
    expect(chunks.at(0)?.days).toBe(7);
    expect(chunks.at(0)?.isAnchor).toBe(true);
  });

  it('should add chunks on both sides of the anchor', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 1, later: 2 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'en',
    });

    expect(toStarts(chunks)).toEqual([
      'Sun Oct 11 2026',
      'Sun Oct 18 2026',
      'Sun Oct 25 2026',
      'Sun Nov 01 2026',
    ]);
  });

  it('should end the anchor chunk at the anchor week for reverse lists', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 0, later: 0 },
      weeksPerStep: 4,
      order: 'reverse-chronological',
      locale: 'en',
    });

    expect(toStarts(chunks)).toEqual(['Sun Sep 27 2026']);
    expect(chunks.at(0)?.days).toBe(28);
  });

  it('should drop later chunks past the upper bound', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 8, 9), earlier: 0, later: 3 },
      weeksPerStep: 2,
      order: 'reverse-chronological',
      locale: 'en',
      upperBound: new Date(2026, 8, 20),
    });

    expect(toStarts(chunks)).toEqual(['Sun Aug 30 2026', 'Sun Sep 13 2026']);
  });

  it('should move an anchor past the upper bound back to the bound', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2028, 0, 1), earlier: 0, later: 0 },
      weeksPerStep: 4,
      order: 'reverse-chronological',
      locale: 'en',
      upperBound: new Date(2026, 9, 18),
    });

    expect(toStarts(chunks)).toEqual(['Sun Sep 27 2026']);
  });

  it('should keep the anchor chunk even past the upper bound', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 11, 1), earlier: 0, later: 0 },
      weeksPerStep: 1,
      order: 'reverse-chronological',
      locale: 'en',
      upperBound: new Date(2026, 9, 18),
    });

    expect(chunks).toHaveLength(1);
  });

  it('should drop earlier chunks before the lower bound', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 28), earlier: 3, later: 0 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'en',
      lowerBound: new Date(2026, 9, 18),
    });

    expect(toStarts(chunks)).toEqual(['Sun Oct 18 2026', 'Sun Oct 25 2026']);
  });

  it('should keep an anchor before the lower bound as the first chunk', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 8, 9), earlier: 2, later: 1 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'en',
      lowerBound: new Date(2026, 9, 18),
    });

    expect(toStarts(chunks)).toEqual(['Sun Sep 06 2026', 'Sun Sep 13 2026']);
  });

  it('should keep an earlier chunk that contains the lower bound', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 2, later: 0 },
      weeksPerStep: 4,
      order: 'reverse-chronological',
      locale: 'en',
      lowerBound: new Date(2026, 8, 10),
    });

    expect(toStarts(chunks)).toEqual(['Sun Aug 30 2026', 'Sun Sep 27 2026']);
  });

  it('should load at least the minimum number of later chunks', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 0, later: 1 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'en',
      minLater: 3,
    });

    expect(chunks).toHaveLength(4);
  });

  it('should start on Monday for a Monday-first locale', () => {
    const chunks = toCalendarChunks({
      range: { anchor: new Date(2026, 9, 21), earlier: 0, later: 0 },
      weeksPerStep: 1,
      order: 'chronological',
      locale: 'nl-NL',
    });

    expect(toStarts(chunks)).toEqual(['Mon Oct 19 2026']);
  });
});
