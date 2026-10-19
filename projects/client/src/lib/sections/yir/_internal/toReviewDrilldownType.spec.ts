import { describe, expect, it } from 'vitest';
import { toReviewDrilldownType } from './toReviewDrilldownType.ts';

describe('util: toReviewDrilldownType', () => {
  it('should label a movie link', () => {
    expect(toReviewDrilldownType('/movies/heretic-2024')).toBe('movie');
  });

  it('should label a show link', () => {
    expect(toReviewDrilldownType('/shows/silo')).toBe('show');
  });

  it('should label a show episode link as a show', () => {
    expect(toReviewDrilldownType('/shows/silo/seasons/1/episodes/2')).toBe(
      'show',
    );
  });

  it('should label a person link', () => {
    expect(toReviewDrilldownType('/people/cillian-murphy?roles=cast')).toBe(
      'person',
    );
  });

  it('should read an absolute url by its path', () => {
    expect(
      toReviewDrilldownType('https://app.trakt.tv/movies/heretic-2024'),
    ).toBe('movie');
  });

  it('should ignore navigation that is not a title or a person', () => {
    expect(toReviewDrilldownType('/users/me')).toBeUndefined();
    expect(toReviewDrilldownType('/users/me/year/2025')).toBeUndefined();
  });

  it('should ignore a missing href', () => {
    expect(toReviewDrilldownType(null)).toBeUndefined();
  });
});
