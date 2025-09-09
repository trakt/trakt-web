import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toDisplayableName } from './toDisplayableName.ts';

describe('toDisplayableName', () => {
  it('should return full name when it exists', () => {
    expect(toDisplayableName(ExtendedUserMappedMock)).toBe(
      ExtendedUserMappedMock.name.full,
    );
  });

  it('should return username with @ prefix when full name is empty string', () => {
    const profile = {
      ...ExtendedUserMappedMock,
      name: {
        full: '',
      },
    };

    expect(toDisplayableName(profile)).toBe(`@${profile.username}`);
  });
});
