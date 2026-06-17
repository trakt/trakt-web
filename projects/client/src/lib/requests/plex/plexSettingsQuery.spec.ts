import { PlexSettingsMappedMock } from '$mocks/data/plex/mapped/PlexSettingsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { plexSettingsQuery } from './plexSettingsQuery.ts';

describe('plexSettingsQuery', () => {
  it('should map snake_case response fields to camelCase', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(plexSettingsQuery({})),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PlexSettingsMappedMock);
  });
});
