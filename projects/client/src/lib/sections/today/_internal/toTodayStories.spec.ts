import type { TodayForYouItem } from '$lib/sections/today/models/TodayForYouItem.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { FollowingActivityMappedMock } from '$mocks/data/users/mapped/FollowingActivityMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toTodayStories } from './toTodayStories.ts';

const forYou: TodayForYouItem[] = [{
  key: 'start-watching-movie-1',
  type: 'start-watching',
  media: MovieHereticMappedMock,
}];

describe('util: toTodayStories', () => {
  it('should put the for you story first, then the titles', () => {
    const { groups } = toTodayStories({
      activities: FollowingActivityMappedMock,
      forYou,
    });

    expect(
      groups.map((group) =>
        group.type === 'for-you'
          ? 'for-you'
          : group.story.actions.map((action) => action.kind).join(',')
      ),
    ).toEqual(['for-you', 'watch,rating', 'comment']);
  });
});
