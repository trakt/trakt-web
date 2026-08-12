import { UserCollectionMappedMock } from '$mocks/data/users/mapped/UserCollectionMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useCurrentUserCollection } from './useCurrentUserCollection.ts';

describe('store: useCurrentUserCollection', () => {
  it('should contain the collected movie and episode ids', async () => {
    const result = await runQuery({
      factory: () => useCurrentUserCollection(),
      waitFor: (collection) => collection != null,
    });

    expect(result).to.deep.equal(UserCollectionMappedMock);
  });
});
