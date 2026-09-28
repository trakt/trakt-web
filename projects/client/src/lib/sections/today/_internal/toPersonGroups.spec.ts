import type { TodayTitleStory } from '$lib/sections/today/models/TodayTitleStory.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import { toPersonGroups } from './toPersonGroups.ts';

const ron = { ...UserProfileHarryMappedMock, key: 'user-2', username: 'ron' };

function action(key: string, user: typeof ron, hour: number) {
  return buildFriendAction({
    key,
    user,
    activityAt: new Date(`2026-09-28T${hour}:00:00.000Z`),
  });
}

const stories: TodayTitleStory[] = [
  {
    key: 'movie',
    media: MovieHereticMappedMock,
    actions: [
      action('a', ron, 12),
      action('b', UserProfileHarryMappedMock, 10),
    ],
    users: [ron, UserProfileHarryMappedMock],
    averageRating: null,
    milestone: null,
    latestAt: new Date('2026-09-28T12:00:00.000Z'),
  },
  {
    key: 'show',
    media: ShowSiloMappedMock,
    actions: [action('c', UserProfileHarryMappedMock, 11)],
    users: [UserProfileHarryMappedMock],
    averageRating: null,
    milestone: null,
    latestAt: new Date('2026-09-28T11:00:00.000Z'),
  },
];

describe('util: toPersonGroups', () => {
  it('should group actions per friend', () => {
    const groups = toPersonGroups(stories);

    expect(groups.map((group) => group.key)).toEqual([
      'user-2',
      UserProfileHarryMappedMock.key,
    ]);
  });

  it('should keep the title on each action, most recent first', () => {
    const harry = toPersonGroups(stories).at(1);

    expect(harry?.actions.map((entry) => entry.media)).toEqual([
      ShowSiloMappedMock,
      MovieHereticMappedMock,
    ]);
  });
});
