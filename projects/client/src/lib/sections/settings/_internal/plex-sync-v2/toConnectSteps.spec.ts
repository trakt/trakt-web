import { describe, expect, it } from 'vitest';
import { toConnectSteps } from './toConnectSteps.ts';

describe('toConnectSteps', () => {
  it('asks whose plays sync when the server has several profiles', () => {
    expect(toConnectSteps({ hasProfiles: true })).to.deep.equal([
      'sign-in',
      'server',
      'profile',
      'sync',
    ]);
  });

  it('skips the profile step for a watchlist-only connection', () => {
    expect(toConnectSteps({ hasProfiles: true, isAccountOnly: true }))
      .to.deep.equal(['sign-in', 'server', 'sync']);
  });

  it('skips the profile step when there is only one profile', () => {
    expect(toConnectSteps({ hasProfiles: false })).to.deep.equal([
      'sign-in',
      'server',
      'sync',
    ]);
  });

  it('adds the history step last when the history feed is on', () => {
    expect(toConnectSteps({ hasProfiles: true, hasHistory: true }))
      .to.deep.equal(['sign-in', 'server', 'profile', 'sync', 'history']);
  });

  it('adds the history step to a watchlist-only-free single profile flow', () => {
    expect(toConnectSteps({ hasProfiles: false, hasHistory: true }))
      .to.deep.equal(['sign-in', 'server', 'sync', 'history']);
  });
});
