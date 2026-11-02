import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toMirShareData } from './toMirShareData.ts';

const data = toMirShareData({
  detail: YirDetailMappedMock,
  profile: UserProfileHarryMappedMock,
  year: 2026,
  month: 10,
});

describe('util: toMirShareData', () => {
  it('should take the totals from the month stats', () => {
    expect(data.totals).toEqual({
      plays: 30,
      minutes: 1350,
      episodes: 24,
      movies: 6,
    });
  });

  it('should tint the card with the most watched show', () => {
    expect(data.colors).toEqual(ShowSiloMappedMock.colors);
  });

  it('should keep the most watched titles in order', () => {
    expect(data.shows.map((item) => [item.title, item.plays])).toEqual([
      ['Silo', 14],
      ['Devs', 10],
    ]);
  });

  it('should drop the webp suffix from poster urls', () => {
    expect(data.firstWatched?.posterUrl).not.toMatch(/\.webp$/);
  });

  it('should show the username next to a full name', () => {
    expect(data.user).toMatchObject({
      name: 'Harry Du Bois',
      username: 'harrier_dubois',
    });
  });

  it('should not repeat the username when there is no full name', () => {
    const anonymous = toMirShareData({
      detail: YirDetailMappedMock,
      profile: {
        ...UserProfileHarryMappedMock,
        name: { full: '', first: '', last: '' },
      },
      year: 2026,
      month: 10,
    });

    expect(anonymous.user).toMatchObject({
      name: '@harrier_dubois',
      username: null,
    });
  });
});
