import { RecommendedByMappedMock } from '$mocks/data/shares/mapped/RecommendedByMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toSharedPillState } from './toSharedPillState.ts';

describe('toSharedPillState', () => {
  it('should not flag a share without recommendations', () => {
    expect(toSharedPillState({ activityCount: 2, recommendedBy: null }))
      .toEqual({ isShared: false, isSharedOnly: false });
  });

  it('should not flag a share when nobody shared', () => {
    const recommendedBy = { users: [], otherCount: 0 };

    expect(toSharedPillState({ activityCount: 0, recommendedBy }))
      .toEqual({ isShared: false, isSharedOnly: false });
  });

  it('should flag a share next to followed activity', () => {
    expect(
      toSharedPillState({
        activityCount: 3,
        recommendedBy: RecommendedByMappedMock,
      }),
    ).toEqual({ isShared: true, isSharedOnly: false });
  });

  it('should flag a share-only pill without followed activity', () => {
    expect(
      toSharedPillState({
        activityCount: 0,
        recommendedBy: RecommendedByMappedMock,
      }),
    ).toEqual({ isShared: true, isSharedOnly: true });
  });

  it('should count sharers that are only in the remainder', () => {
    const recommendedBy = { users: [], otherCount: 2 };

    expect(toSharedPillState({ activityCount: 0, recommendedBy }).isShared)
      .toBe(true);
  });
});
