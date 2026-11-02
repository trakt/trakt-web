import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toProfileShareData } from './toProfileShareData.ts';

const data = toProfileShareData(UserProfileHarryMappedMock);

describe('util: toProfileShareData', () => {
  it('should show the full name with the username', () => {
    expect(data.user).toMatchObject({
      name: 'Harry Du Bois',
      username: 'harrier_dubois',
      avatarUrl: UserProfileHarryMappedMock.avatar.url,
    });
  });

  it('should take the year the account was created', () => {
    expect(data.joinedYear).toBe(
      UserProfileHarryMappedMock.joinedAt?.getUTCFullYear(),
    );
  });

  it('should carry the membership for the avatar ring and badge', () => {
    expect(data.user).toMatchObject({
      isVip: UserProfileHarryMappedMock.isVip,
      isDirector: UserProfileHarryMappedMock.isDirector,
    });
  });
});
