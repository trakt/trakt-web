import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { reelPosters } from './reelPosters.ts';

describe('util: reelPosters', () => {
  it('should always return nine slots', () => {
    expect(reelPosters(null)).toHaveLength(9);
    expect(reelPosters(YirDetailMappedMock)).toHaveLength(9);
  });

  it('should pad missing posters with null', () => {
    expect(reelPosters(YirDetailMappedMock).filter((url) => url === null))
      .toHaveLength(5);
  });

  it('should order posters by plays', () => {
    expect(reelPosters(YirDetailMappedMock).at(0)).toBe(
      YirDetailMappedMock.mostWatched.shows.at(0)?.entry.poster.url.medium,
    );
  });
});
