import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { ExtendedUserMappedMock } from '../../../../mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { currentUserSettingsQuery } from './currentUserSettingsQuery.ts';

describe('currentUserSettingsQuery', () => {
  it('should query for user profile', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserSettingsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ExtendedUserMappedMock);
  });
});
