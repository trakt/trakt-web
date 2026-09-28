import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { FollowingActivityMappedMock } from '$mocks/data/users/mapped/FollowingActivityMappedMock.ts';
import type { TodayForYouItem } from '$lib/sections/today/models/TodayForYouItem.ts';
import { describe, expect, it } from 'vitest';
import { toFilteredStories } from './toFilteredStories.ts';

const forYou: TodayForYouItem[] = [{
  key: 'start-watching-movie-1',
  type: 'start-watching',
  media: MovieHereticMappedMock,
}];

function groupTypes(filter: Parameters<typeof toFilteredStories>[0]['filter']) {
  return toFilteredStories({
    activities: FollowingActivityMappedMock,
    forYou,
    filter,
  }).groups.map((group) =>
    group.type === 'for-you'
      ? 'for-you'
      : group.story.actions.map((action) => action.kind).join(',')
  );
}

describe('util: toFilteredStories', () => {
  it('should keep everything for all', () => {
    expect(groupTypes('all')).toEqual(['for-you', 'watch,rating', 'comment']);
  });

  it('should keep only for you items for the for you filter', () => {
    expect(groupTypes('mine')).toEqual(['for-you']);
  });

  it('should keep only the chosen kind of friend activity', () => {
    expect(groupTypes('rated')).toEqual(['rating']);
    expect(groupTypes('comments')).toEqual(['comment']);
  });
});
