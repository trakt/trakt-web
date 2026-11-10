import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { PersonalListsMappedMock } from '$mocks/data/users/mapped/PersonalListsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { getListUrl } from './getListUrl.ts';

const baseList = assertDefined(PersonalListsMappedMock.at(0));

const userList = (userSlug: string | null): MediaListSummary => ({
  ...baseList,
  slug: 'sci-fi',
  user: { ...baseList.user, slug: userSlug },
});

describe('util: getListUrl', () => {
  it('should point the default watchlist at the user watchlist', () => {
    expect(getListUrl({ type: 'watchlist', intent: 'default' })).toBe(
      '/users/me/watchlist',
    );
  });

  it('should point a non-default watchlist intent at start watching', () => {
    expect(getListUrl({ type: 'watchlist', intent: 'start' })).toBe(
      '/users/me/start-watching',
    );
  });

  it('should carry the sort params', () => {
    expect(
      getListUrl({
        type: 'watchlist',
        intent: 'default',
        sortBy: 'added',
        sortHow: 'desc',
      }),
    ).toBe('/users/me/watchlist?sort_by=added&sort_how=desc');
  });

  it('should only carry the sort params that are set', () => {
    expect(
      getListUrl({ type: 'favorites', slug: 'harry', sortHow: 'asc' }),
    ).toBe('/profile/harry/favorites?sort_how=asc');
  });

  it('should link favorites and progress to the profile', () => {
    expect(getListUrl({ type: 'favorites', slug: 'harry' })).toBe(
      '/profile/harry/favorites',
    );
    expect(getListUrl({ type: 'progress', slug: 'harry' })).toBe(
      '/profile/harry/progress',
    );
  });

  it('should link a user list under its owner', () => {
    expect(getListUrl({ type: 'user-list', list: userList('harry') })).toBe(
      '/users/harry/lists/sci-fi',
    );
  });

  it('should link a list without an owner to the official lists', () => {
    expect(getListUrl({ type: 'user-list', list: userList(null) })).toBe(
      '/lists/official/sci-fi',
    );
  });
});
