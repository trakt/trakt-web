import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { useIsFollowing } from './useIsFollowing.ts';

describe('store: useIsFollowing', () => {
  describe('when authorized', () => {
    beforeEach(() => {
      setAuthorization(true);
    });

    it('should be true for an approved followed user', async () => {
      const result = await runQuery({
        factory: () =>
          useIsFollowing(UserProfileHarryMappedMock.slug ?? '').isFollowing,
        waitFor: (value) => value === true,
      });

      expect(result).to.equal(true);
    });

    it('should be false for a user that is not followed', async () => {
      const result = await runQuery({
        factory: () => useIsFollowing('not-a-followed-user').isFollowing,
        waitFor: (value) => value === false,
      });

      expect(result).to.equal(false);
    });
  });

  describe('when unauthorized', () => {
    beforeEach(() => {
      setAuthorization(false);
    });

    it('should be false', async () => {
      const result = await runQuery({
        factory: () =>
          useIsFollowing(UserProfileHarryMappedMock.slug ?? '').isFollowing,
        waitFor: (value) => value === false,
      });

      expect(result).to.equal(false);
    });
  });
});
