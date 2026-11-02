import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toProfileImagePath } from './toProfileImagePath.ts';
import { toProfileShareData } from './toProfileShareData.ts';

const data = toProfileShareData(UserProfileHarryMappedMock);

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
      /^images\/share\/profile\/v\d+\/og\/harry\/[0-9a-f]{12}\.jpg$/,
    );
  });
});
