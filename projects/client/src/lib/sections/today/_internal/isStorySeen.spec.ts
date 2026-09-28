import type { TodayStoryGroup } from '$lib/sections/today/models/TodayStoryGroup.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { isStorySeen } from './isStorySeen.ts';

const latestAt = new Date('2026-09-28T10:00:00.000Z');

const group: TodayStoryGroup = {
  key: 'movie-1',
  type: 'title',
  story: {
    key: 'movie-1',
    media: MovieHereticMappedMock,
    actions: [],
    users: [],
    averageRating: null,
    milestone: null,
    latestAt,
  },
  frames: [],
};

describe('util: isStorySeen', () => {
  it('should be unseen when never opened', () => {
    expect(isStorySeen({ group, seenStories: {} })).toBe(false);
  });

  it('should be seen when opened after the latest activity', () => {
    const seenStories = { 'movie-1': latestAt.getTime() + 1 };

    expect(isStorySeen({ group, seenStories })).toBe(true);
  });

  it('should be unseen again when friends were active after it was opened', () => {
    const seenStories = { 'movie-1': latestAt.getTime() - 1 };

    expect(isStorySeen({ group, seenStories })).toBe(false);
  });
});
