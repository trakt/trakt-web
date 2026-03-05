import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { describe, expect, it } from 'vitest';
import { mapToSummaryStatus } from './mapToSummaryStatus.ts';

describe('mapToSummaryStatus', () => {
  const now = new Date('2024-03-15T00:00:00Z');

  const createMediaEntry = (
    overrides: Pick<MediaEntry, 'status' | 'airDate'>,
  ): MediaEntry => {
    return overrides as MediaEntry;
  };

  it('returns "released" when airDate is today', () => {
    const media = createMediaEntry({
      status: 'released',
      airDate: now,
    });
    expect(mapToSummaryStatus({ media, now })).toBe('released');
  });

  it('returns "released" when airDate is within the last month', () => {
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const media = createMediaEntry({
      status: 'released',
      airDate: twoWeeksAgo,
    });
    expect(mapToSummaryStatus({ media, now })).toBe('released');
  });

  it('returns undefined when airDate is older than one month', () => {
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const media = createMediaEntry({
      status: 'released',
      airDate: twoMonthsAgo,
    });
    expect(mapToSummaryStatus({ media, now })).toBeUndefined();
  });

  it('returns the status for unreleased media', () => {
    const media = createMediaEntry({
      status: 'canceled',
      airDate: now,
    });
    expect(mapToSummaryStatus({ media, now })).toBe('canceled');
  });

  it('returns the status for older unreleased media', () => {
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const media = createMediaEntry({
      status: 'canceled',
      airDate: twoMonthsAgo,
    });
    expect(mapToSummaryStatus({ media, now })).toBe('canceled');
  });
});
