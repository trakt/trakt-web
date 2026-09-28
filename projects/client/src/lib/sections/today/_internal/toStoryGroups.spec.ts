import type { TodayForYouItem } from '$lib/sections/today/models/TodayForYouItem.ts';
import type { TodayTitleStory } from '$lib/sections/today/models/TodayTitleStory.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import { toStoryGroups } from './toStoryGroups.ts';

const ron = { ...UserProfileHarryMappedMock, key: 'user-2', username: 'ron' };
const at = new Date('2026-09-28T10:00:00.000Z');

function story(users: Array<typeof ron>): TodayTitleStory {
  return {
    key: `movie-${users.length}`,
    media: MovieHereticMappedMock,
    actions: users.map((user) =>
      buildFriendAction({ key: user.key, user, activityAt: at })
    ),
    users,
    averageRating: null,
    milestone: null,
    latestAt: at,
  };
}

const forYouItem: TodayForYouItem = {
  key: 'start-watching-movie-1',
  type: 'start-watching',
  media: MovieHereticMappedMock,
};

describe('util: toStoryGroups', () => {
  it('should put the for you story first', () => {
    const groups = toStoryGroups({
      forYou: [forYouItem],
      titles: [story([ron])],
    });

    expect(groups.map((group) => group.type)).toEqual(['for-you', 'title']);
  });

  it('should skip the for you story when there is nothing new', () => {
    const groups = toStoryGroups({ forYou: [], titles: [story([ron])] });

    expect(groups.map((group) => group.type)).toEqual(['title']);
  });

  it('should open a title with a summary when several friends were active', () => {
    const [group] = toStoryGroups({
      forYou: [],
      titles: [story([ron, UserProfileHarryMappedMock])],
    });

    expect(group?.frames.map((frame) => frame.type)).toEqual([
      'summary',
      'friend',
      'friend',
    ]);
  });

  it('should show a single friend without a summary', () => {
    const [group] = toStoryGroups({ forYou: [], titles: [story([ron])] });

    expect(group?.frames.map((frame) => frame.type)).toEqual(['friend']);
  });
});
