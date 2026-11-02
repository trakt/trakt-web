import { describe, expect, it } from 'vitest';
import { toMirImagePath } from './toMirImagePath.ts';

const user = {
  name: 'Sean',
  username: null,
  avatarUrl: 'https://media.trakt.tv/sean.png',
  isVip: true,
  badgeLabel: 'DIRECTOR',
};

const toPath = (overrides = {}) =>
  toMirImagePath({
    shape: 'cover',
    slug: 'sean',
    year: 2026,
    month: 10,
    user: { ...user, ...overrides },
  });

describe('util: toMirImagePath', () => {
  it('should keep every image of a month in its own folder', async () => {
    expect(await toPath()).toMatch(
      /^images\/share\/mir\/v\d+\/cover\/sean\/2026-10\/[0-9a-f]{12}\.jpg$/,
    );
  });

  it('should change when the avatar or name changes', async () => {
    expect(
      await toPath({ avatarUrl: 'https://media.trakt.tv/new.png' }),
    ).not.toBe(await toPath());
    expect(await toPath({ name: 'Sean R' })).not.toBe(await toPath());
  });

  it('should change when the membership changes', async () => {
    expect(await toPath({ isVip: false })).not.toBe(await toPath());
  });
});
