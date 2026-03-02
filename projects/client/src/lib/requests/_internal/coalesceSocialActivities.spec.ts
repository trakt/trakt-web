import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { SocialActivityMappedMock } from '$mocks/data/users/mapped/SocialActivityMappedMock.ts';
import { describe, expect, it } from 'vitest';
import type { UserProfile } from '../models/UserProfile.ts';
import {
  ACTIVITY_COALESCE_WINDOW,
  coalesceSocialActivities,
} from './coalesceSocialActivities.ts';

describe('coalesceSocialActivities', () => {
  const createUserProfile = (username: string): UserProfile => ({
    'name': {
      'full': username,
      'first': username,
      'last': username,
    },
    username,
    'slug': username,
    'id': 42,
    'key': 'user-42',
    'avatar': { 'url': 'https://avatar.png' },
    'private': false,
    'isVip': true,
    'isDirector': false,
    'isDeleted': false,
  });

  it('should not coalesce activities of differing media items', () => {
    const activities = SocialActivityMappedMock;
    expect(coalesceSocialActivities(activities)).toEqual(activities);
  });

  it('should coalesce activities that are similar', () => {
    const now = new Date();

    const userA = createUserProfile('user_a');
    const userB = createUserProfile('user_b');

    const activityA = {
      ...assertDefined(SocialActivityMappedMock.at(0)),
      users: [userA],
      activityAt: now,
      rating: 4,
    };

    const activityB = {
      ...activityA,
      users: [userB],
      activityAt: new Date(now.getTime() + ACTIVITY_COALESCE_WINDOW / 2),
      rating: 8,
    };

    const coalesced = coalesceSocialActivities([activityA, activityB]);

    expect(coalesced).toHaveLength(1);
    expect(coalesced.at(0)?.users).toContain(userA);
    expect(coalesced.at(0)?.users).toContain(userB);
    expect(coalesced.at(0)?.rating).toBe(6);
  });

  it('should not take undefined ratings into count', () => {
    const now = new Date();

    const userA = createUserProfile('user_a');
    const userB = createUserProfile('user_b');

    const activityA = {
      ...assertDefined(SocialActivityMappedMock.at(0)),
      users: [userA],
      activityAt: now,
      rating: null,
    };

    const activityB = {
      ...activityA,
      users: [userB],
      activityAt: new Date(now.getTime() + ACTIVITY_COALESCE_WINDOW / 2),
      rating: 8,
    };

    const coalesced = coalesceSocialActivities([activityA, activityB]);

    expect(coalesced).toHaveLength(1);
    expect(coalesced.at(0)?.rating).toBe(8);
  });

  it('should average multiple ratings correctly', () => {
    const now = new Date();

    const userA = createUserProfile('user_a');
    const userB = createUserProfile('user_b');
    const userC = createUserProfile('user_c');

    const activityA = {
      ...assertDefined(SocialActivityMappedMock.at(0)),
      users: [userA],
      activityAt: now,
      rating: 3,
    };

    const activityB = {
      ...activityA,
      users: [userB],
      activityAt: new Date(now.getTime() + ACTIVITY_COALESCE_WINDOW / 2),
      rating: 8,
    };

    const activityC = {
      ...activityA,
      users: [userC],
      activityAt: new Date(now.getTime() + ACTIVITY_COALESCE_WINDOW / 2),
      rating: 4,
    };

    const coalesced = coalesceSocialActivities([
      activityA,
      activityB,
      activityC,
    ]);

    expect(coalesced).toHaveLength(1);
    expect(coalesced.at(0)?.rating).toBe(5);
  });

  it('should not coalesce activities that are too far apart', () => {
    const now = new Date();

    const userA = createUserProfile('user_a');
    const userB = createUserProfile('user_b');

    const activityA = {
      ...assertDefined(SocialActivityMappedMock.at(0)),
      users: [userA],
      activityAt: now,
    };

    const activityB = {
      ...activityA,
      users: [userB],
      activityAt: new Date(now.getTime() - ACTIVITY_COALESCE_WINDOW * 2),
    };

    const coalesced = coalesceSocialActivities([activityA, activityB]);

    expect(coalesced).toHaveLength(2);
    expect(coalesced.at(0)?.users).toEqual([userA]);
    expect(coalesced.at(1)?.users).toEqual([userB]);
  });

  it('should omit duplicate users', () => {
    const now = new Date();

    const userA = createUserProfile('user_a');

    const activityA = {
      ...assertDefined(SocialActivityMappedMock.at(0)),
      users: [userA],
      activityAt: now,
    };

    const activityB = {
      ...activityA,
      users: [userA],
      activityAt: new Date(now.getTime() + ACTIVITY_COALESCE_WINDOW / 2),
    };

    const coalesced = coalesceSocialActivities([activityA, activityB]);

    expect(coalesced).toHaveLength(1);
    expect(coalesced.at(0)?.users).toEqual([userA]);
  });
});
