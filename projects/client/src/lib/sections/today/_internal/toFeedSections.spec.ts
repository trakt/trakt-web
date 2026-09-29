import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import type { TodayPersonAction } from '../models/TodayPersonAction.ts';
import { toFeedSections } from './toFeedSections.ts';

function personAction(key: string, activityAt: Date): TodayPersonAction {
  return {
    ...buildFriendAction({ key, activityAt }),
    media: MovieHereticMappedMock,
  };
}

describe('util: toFeedSections', () => {
  it('should return no sections for no actions', () => {
    expect(toFeedSections([])).toEqual([]);
  });

  it('should group actions of the same part of the day together', () => {
    const sections = toFeedSections([
      personAction('a', new Date(2026, 8, 28, 20)),
      personAction('b', new Date(2026, 8, 28, 19)),
      personAction('c', new Date(2026, 8, 28, 9)),
    ]);

    expect(sections.map((section) => section.part)).toEqual([
      'evening',
      'morning',
    ]);
    expect(sections.at(0)?.entries.map((entry) => entry.key)).toEqual([
      'a',
      'b',
    ]);
  });

  it('should keep the same part on different days apart', () => {
    const sections = toFeedSections([
      personAction('a', new Date(2026, 8, 28, 20)),
      personAction('b', new Date(2026, 8, 27, 20)),
    ]);

    expect(sections).toHaveLength(2);
  });
});
