import { ExtendedUserMappedMock } from '$mocks/data/users/ExtendedUserSettingsMappedMock.ts';
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
});
