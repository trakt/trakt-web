import { UserStatsMappedMock } from '$mocks/data/users/mapped/UserStatsMappedMock.ts';
import { UserStatsResponseMock } from '$mocks/data/users/response/UserStatsResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToUserStats } from './mapToUserStats.ts';

describe('util: mapToUserStats', () => {
  it('should sum movie and episode plays into playCount', () => {
    expect(mapToUserStats(UserStatsResponseMock).playCount).toBe(6100);
  });

  it('should sum movie and episode minutes into minuteCount', () => {
    expect(mapToUserStats(UserStatsResponseMock).minuteCount).toBe(260_000);
  });

  it('should sum comments across movies, shows, episodes and seasons', () => {
    expect(mapToUserStats(UserStatsResponseMock).commentCount).toBe(18);
  });

  it('should map the full response to the domain model', () => {
    expect(mapToUserStats(UserStatsResponseMock)).toEqual(UserStatsMappedMock);
  });
});
