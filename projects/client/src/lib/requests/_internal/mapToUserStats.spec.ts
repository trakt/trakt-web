import { UserStatsFreeMappedMock } from '$mocks/data/users/mapped/UserStatsFreeMappedMock.ts';
import { UserStatsMappedMock } from '$mocks/data/users/mapped/UserStatsMappedMock.ts';
import { UserStatsFreeResponseMock } from '$mocks/data/users/response/UserStatsFreeResponseMock.ts';
import { UserStatsResponseMock } from '$mocks/data/users/response/UserStatsResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToUserStats } from './mapToUserStats.ts';

describe('util: mapToUserStats', () => {
  it('should camel case the total minutes', () => {
    expect(mapToUserStats(UserStatsResponseMock).totalMinutes).toBe(260_000);
  });

  it('should camel case the total plays', () => {
    expect(mapToUserStats(UserStatsResponseMock).totalPlays).toBe(6100);
  });

  it('should map the rating distribution', () => {
    expect(mapToUserStats(UserStatsResponseMock).ratings.distribution).toEqual(
      UserStatsResponseMock.ratings.distribution,
    );
  });

  it('should map the full response to the domain model', () => {
    expect(mapToUserStats(UserStatsResponseMock)).toEqual(UserStatsMappedMock);
  });

  describe('when the response omits the precomputed fields', () => {
    it('should null out the progress and list counts', () => {
      const stats = mapToUserStats(UserStatsFreeResponseMock);

      expect(stats.progress).toBeNull();
      expect(stats.lists).toBeNull();
    });

    it('should derive the total minutes from movies and episodes', () => {
      expect(mapToUserStats(UserStatsFreeResponseMock).totalMinutes).toBe(175);
    });

    it('should derive the total plays from movies and episodes', () => {
      expect(mapToUserStats(UserStatsFreeResponseMock).totalPlays).toBe(2);
    });

    it('should map the response to the domain model', () => {
      expect(mapToUserStats(UserStatsFreeResponseMock)).toEqual(
        UserStatsFreeMappedMock,
      );
    });
  });
});
