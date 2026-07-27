import { describe, expect, it } from 'vitest';
import { toCoverMediaRef } from './toCoverMediaRef.ts';

describe('util: toCoverMediaRef', () => {
  it('should recover a movie reference from a fanart url', () => {
    expect(
      toCoverMediaRef(
        'https://walter-r2.trakt.tv/images/movies/000/916/302/fanarts/medium/626327d7b4.jpg.webp',
      ),
    ).toEqual({ type: 'movie', id: 916302 });
  });

  it('should recover a show reference from a fanart url', () => {
    expect(
      toCoverMediaRef(
        'https://walter-r2.trakt.tv/images/shows/000/180/770/fanarts/thumb/80d39f8578.jpg.webp',
      ),
    ).toEqual({ type: 'show', id: 180770 });
  });

  it('should recover an episode reference from a screenshot url', () => {
    expect(
      toCoverMediaRef(
        'https://walter-r2.trakt.tv/images/episodes/000/298/461/screenshots/medium/abc123.jpg.webp',
      ),
    ).toEqual({ type: 'episode', id: 298461 });
  });

  it('should ignore image size and extension differences', () => {
    const original = toCoverMediaRef(
      'https://walter-r2.trakt.tv/images/movies/000/916/302/fanarts/original/626327d7b4.jpg',
    );
    const thumb = toCoverMediaRef(
      'https://walter-r2.trakt.tv/images/movies/000/916/302/fanarts/thumb/626327d7b4.jpg.webp',
    );

    expect(original).toEqual({ type: 'movie', id: 916302 });
    expect(original).toEqual(thumb);
  });

  it('should return null for a non-media cover (e.g. a vip header)', () => {
    expect(
      toCoverMediaRef(
        'https://walter.trakt.tv/images/users/014/366/083/headers/original/disco_cop.png',
      ),
    ).toBeNull();
  });

  it('should return null for nullish input', () => {
    expect(toCoverMediaRef(null)).toBeNull();
    expect(toCoverMediaRef(undefined)).toBeNull();
    expect(toCoverMediaRef('')).toBeNull();
  });
});
