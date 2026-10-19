import { describe, expect, it } from 'vitest';
import type { JellyfinSignInDraft } from './models/JellyfinSignInDraft.ts';
import { toJellyfinSignIn } from './toJellyfinSignIn.ts';

const DRAFT: JellyfinSignInDraft = {
  serverUrl: 'https://jellyfin.example.com',
  method: 'quick-connect',
  username: '',
  password: '',
};

describe('toJellyfinSignIn', () => {
  it('asks for a Quick Connect code with only an address', () => {
    expect(toJellyfinSignIn(DRAFT)).to.deep.equal({
      method: 'quick-connect',
      serverUrl: 'https://jellyfin.example.com',
    });
  });

  it('adds https to an address typed without a scheme', () => {
    expect(
      toJellyfinSignIn({ ...DRAFT, serverUrl: '  jellyfin.example.com:8920 ' }),
    ).to.deep.equal({
      method: 'quick-connect',
      serverUrl: 'https://jellyfin.example.com:8920',
    });
  });

  it('keeps the scheme the user typed', () => {
    expect(
      toJellyfinSignIn({ ...DRAFT, serverUrl: 'http://jellyfin.example.com' }),
    ).to.deep.equal({
      method: 'quick-connect',
      serverUrl: 'http://jellyfin.example.com',
    });
  });

  it('waits for an address', () => {
    expect(toJellyfinSignIn({ ...DRAFT, serverUrl: '   ' })).to.equal(null);
  });

  it('waits for a username before a password sign-in', () => {
    expect(
      toJellyfinSignIn({ ...DRAFT, method: 'password', password: 'secret' }),
    ).to.equal(null);
  });

  it('signs in with a trimmed username and the password as typed', () => {
    expect(
      toJellyfinSignIn({
        ...DRAFT,
        method: 'password',
        username: ' harry ',
        password: ' secret ',
      }),
    ).to.deep.equal({
      method: 'password',
      serverUrl: 'https://jellyfin.example.com',
      username: 'harry',
      password: ' secret ',
    });
  });

  it('allows an empty password, which Jellyfin accounts can have', () => {
    expect(
      toJellyfinSignIn({ ...DRAFT, method: 'password', username: 'harry' }),
    ).to.deep.equal({
      method: 'password',
      serverUrl: 'https://jellyfin.example.com',
      username: 'harry',
      password: '',
    });
  });
});
