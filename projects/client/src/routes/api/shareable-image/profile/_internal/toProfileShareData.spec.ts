import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toProfileImagePath } from './toProfileImagePath.ts';
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

  describe('with a cover and a location', () => {
    const profile = {
      ...UserProfileHarryMappedMock,
      location: ' Revachol ',
      cover: { url: 'https://media.trakt.tv/covers/harry.jpg' },
    };

    it('should show them on a public profile', () => {
      expect(toProfileShareData(profile)).toMatchObject({
        location: 'Revachol',
        coverUrl: 'https://media.trakt.tv/covers/harry.jpg',
      });
    });

    it('should leave them out of a private profile', () => {
      expect(toProfileShareData({ ...profile, private: true })).toMatchObject({
        location: null,
        coverUrl: null,
      });
    });
  });
});

describe('util: toProfileImagePath', () => {
  it('should keep the same key for the same profile', async () => {
    expect(await toProfileImagePath({ slug: 'harry', data })).toBe(
      await toProfileImagePath({ slug: 'harry', data }),
    );
  });

  it('should change the key when the avatar changes', async () => {
    const changed = {
      ...data,
      user: { ...data.user, avatarUrl: 'https://media.trakt.tv/new.png' },
    };

    expect(await toProfileImagePath({ slug: 'harry', data: changed })).not.toBe(
      await toProfileImagePath({ slug: 'harry', data }),
    );
  });

  it('should keep the key under the profile prefix', async () => {
    expect(await toProfileImagePath({ slug: 'harry', data })).toMatch(
      /^images\/share\/profile\/og\/harry\/[0-9a-f]{12}\.jpg$/,
    );
  });
});
