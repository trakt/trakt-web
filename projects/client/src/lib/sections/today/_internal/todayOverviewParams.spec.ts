import { describe, expect, it } from 'vitest';
import { todayOverviewParams } from './todayOverviewParams.ts';

describe('util: todayOverviewParams', () => {
  it('should default to everything grouped by title', () => {
    const params = todayOverviewParams(new URLSearchParams());

    expect(params.filter).toBe('all');
    expect(params.grouping).toBe('title');
  });

  it('should read the filter and grouping from the url', () => {
    const params = todayOverviewParams(
      new URLSearchParams('filter=rated&group=person'),
    );

    expect(params.filter).toBe('rated');
    expect(params.grouping).toBe('person');
  });

  it('should ignore unknown values', () => {
    const params = todayOverviewParams(
      new URLSearchParams('filter=nope&group=nope'),
    );

    expect(params.filter).toBe('all');
    expect(params.grouping).toBe('title');
  });

  it('should read the chosen day from the url', () => {
    expect(todayOverviewParams(new URLSearchParams('day=2026-09-25')).day)
      .toBe('2026-09-25');
    expect(todayOverviewParams(new URLSearchParams()).day).toBeNull();
  });
});
