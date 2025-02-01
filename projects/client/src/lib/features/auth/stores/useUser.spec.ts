import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { UserFavoritedMappedMock } from '$mocks/data/users/mapped/UserFavoritedMappedMock.ts';
import { UserRatedMappedMock } from '$mocks/data/users/mapped/UserRatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useUser } from './useUser.ts';

describe('store: useUser', () => {
  it('should contain the user profile', async () => {
    const result = await runQuery({
      factory: () => useUser().user,
    });

    expect(result).to.deep.equal(ExtendedUserMappedMock);
  });

  it('should contain the user ratings', async () => {
    const result = await runQuery({
      factory: () => useUser().ratings,
    });

    expect(result).to.deep.equal(UserRatedMappedMock);
  });

  it('should contain the user favorites', async () => {
    const result = await runQuery({
      factory: () => useUser().favorites,
    });

    expect(result).to.deep.equal(UserFavoritedMappedMock);
  });
});
