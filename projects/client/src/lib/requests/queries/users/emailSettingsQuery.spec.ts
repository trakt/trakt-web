import { EmailSettingsMappedMock } from '$mocks/data/users/mapped/EmailSettingsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { emailSettingsQuery } from './emailSettingsQuery.ts';

describe('emailSettingsQuery', () => {
  it('should map the email settings response', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(emailSettingsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EmailSettingsMappedMock);
  });
});
