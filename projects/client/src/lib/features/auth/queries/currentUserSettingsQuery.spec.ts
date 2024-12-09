import { describe, expect, it } from 'vitest';
import { ExtendedUserMappedMock } from '../../../../mocks/data/users/ExtendedUserSettingsMappedMock.ts';
import { currentUserSettingsQuery } from './currentUserSettingsQuery.ts';

describe('currentUserSettingsQuery', () => {
  it('should return the current user profile', async () => {
    const result = await currentUserSettingsQuery().queryFn();

    expect(result).toEqual(ExtendedUserMappedMock);
  });
});
