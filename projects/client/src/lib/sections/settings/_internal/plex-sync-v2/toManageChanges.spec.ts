import { describe, expect, it } from 'vitest';
import { toManageChanges } from './toManageChanges.ts';

const libraries = [
  { id: 1, enabled: true },
  { id: 2, enabled: false },
];

describe('toManageChanges', () => {
  it('sends nothing when the draft matches the server', () => {
    expect(toManageChanges({
      libraries,
      enabledLibraryIds: [1],
      currentAccountId: '1',
      accountId: '1',
    })).to.deep.equal({});
  });

  it('sends the full library selection when it changed', () => {
    expect(toManageChanges({
      libraries,
      enabledLibraryIds: [2, 1],
      currentAccountId: '1',
      accountId: '1',
    })).to.deep.equal({ enabledLibraryIds: [2, 1] });
  });

  it('sends a newly picked profile', () => {
    expect(toManageChanges({
      libraries,
      enabledLibraryIds: [1],
      currentAccountId: '1',
      accountId: '7',
    })).to.deep.equal({ syncAccountId: '7' });
  });

  it('ignores a profile while the profiles are unknown', () => {
    expect(toManageChanges({
      libraries,
      enabledLibraryIds: [1],
      currentAccountId: null,
      accountId: null,
    })).to.deep.equal({});
  });
});
