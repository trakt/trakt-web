import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import type { TodayTitleStory } from '../models/TodayTitleStory.ts';
import { pickHeroStory } from './pickHeroStory.ts';

const friend = (key: string) => ({ ...UserProfileHarryMappedMock, key });

function story(
  key: string,
  overrides: Partial<TodayTitleStory> = {},
): TodayTitleStory {
  return {
    key,
    media: MovieHereticMappedMock,
    actions: [],
    users: [friend('a')],
    averageRating: null,
    milestone: null,
    latestAt: new Date(),
    ...overrides,
  };
}

describe('util: pickHeroStory', () => {
  it('should pick nothing without stories', () => {
    expect(pickHeroStory([])).toBeNull();
  });

  it('should prefer a story with a milestone', () => {
    const milestone = story('milestone', {
      milestone: { type: 'series-start', season: 1 },
    });

    expect(
      pickHeroStory([
        story('busy', { users: [friend('a'), friend('b')] }),
        milestone,
      ]),
    ).toBe(milestone);
  });

  it('should fall back to the story with the most people, keeping the earlier one on a tie', () => {
    const first = story('first');
    const busy = story('busy', { users: [friend('a'), friend('b')] });

    expect(pickHeroStory([first, busy])?.key).toBe('busy');
    expect(pickHeroStory([first, story('second')])?.key).toBe('first');
  });
});
