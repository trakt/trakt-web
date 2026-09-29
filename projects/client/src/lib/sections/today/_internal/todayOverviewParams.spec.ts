import { describe, expect, it } from 'vitest';
import { todayOverviewParams } from './todayOverviewParams.ts';

describe('util: todayOverviewParams', () => {
  it('should default to grouping by title', () => {
    const params = todayOverviewParams(new URLSearchParams());

    expect(params.grouping).toBe('title');
  });

  it('should read the grouping from the url', () => {
    const params = todayOverviewParams(new URLSearchParams('group=time'));

    expect(params.grouping).toBe('time');
  });

  it('should ignore unknown values', () => {
    const params = todayOverviewParams(
      new URLSearchParams('group=nope'),
    );

    expect(params.grouping).toBe('title');
  });

  it('should read the chosen day from the url', () => {
    expect(todayOverviewParams(new URLSearchParams('day=2026-09-25')).day)
      .toBe('2026-09-25');
    expect(todayOverviewParams(new URLSearchParams()).day).toBeNull();
  });
});
