import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { UserFavoritedMappedMock } from '$mocks/data/users/mapped/UserFavoritedMappedMock.ts';
import { UserRatedMappedMock } from '$mocks/data/users/mapped/UserRatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { combineLatest } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useUser } from './useUser.ts';

describe('store: useUser', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

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
  it('should share one instance within the same context', async () => {
    const { first, second } = await renderStore(() => ({
      first: useUser(),
      second: useUser(),
    }));

    expect(first).to.equal(second);
  });

  describe('when unauthorized', () => {
    beforeEach(() => {
      setAuthorization(false);
    });

    it('should be an anonymous user', async () => {
      const result = await runQuery({ factory: () => useUser().user });

      expect(result.id).to.equal(0);
      expect(result.slug).to.equal('');
      expect(result.isVip).to.equal(false);
    });

    it('should have nothing for an anonymous user', async () => {
      const result = await runQuery({
        factory: () => {
          const {
            ratings,
            watchlist,
            history,
            collection,
            limits,
            network,
            blocked,
          } = useUser();

          return combineLatest({
            ratings,
            watchlist,
            history,
            collection,
            limits,
            network,
            blocked,
          });
        },
      });

      expect(result.ratings?.movies.size).to.equal(0);
      expect(result.ratings?.shows.size).to.equal(0);
      expect(result.watchlist?.movies.size).to.equal(0);
      expect(result.history?.shows.size).to.equal(0);
      expect(result.collection?.episodes.size).to.equal(0);
      expect(result.limits).to.equal(null);
      expect(result.network?.following).to.deep.equal([]);
      expect(result.blocked.size).to.equal(0);
    });
  });
});
