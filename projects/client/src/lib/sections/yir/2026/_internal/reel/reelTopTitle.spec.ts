import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { reelTopTitle } from './reelTopTitle.ts';

describe('util: reelTopTitle', () => {
  it('should return null without detail', () => {
    expect(reelTopTitle(null)).toBeNull();
  });

  it('should pick the most played title across shows and movies', () => {
    expect(reelTopTitle(YirDetailMappedMock)?.plays).toBe(14);
  });

  it('should fall back to movies when there are no shows', () => {
    const detail = {
      ...YirDetailMappedMock,
      mostWatched: { ...YirDetailMappedMock.mostWatched, shows: [] },
    };

    expect(reelTopTitle(detail)?.entry.type).toBe('movie');
  });
});
