import { describe, expect, it } from 'vitest';
import { reconcileClientState } from './reconcileClientState.ts';

const merge = (
  local: Record<string, string>,
  remote: Record<string, string>,
) => ({ ...remote, ...local });

describe('reconcileClientState', () => {
  it('should upload local state the server does not have yet', () => {
    expect(
      reconcileClientState({
        local: { welcome: 'dismissed' },
        remote: null,
        empty: {},
        merge,
      }),
    ).to.deep.equal({ value: { welcome: 'dismissed' }, shouldUpload: true });
  });

  it('should not upload when both sides are empty', () => {
    expect(
      reconcileClientState({ local: {}, remote: null, empty: {}, merge }),
    ).to.deep.equal({ value: {}, shouldUpload: false });
  });

  it('should take the server state without uploading it back', () => {
    expect(
      reconcileClientState({
        local: {},
        remote: { yir: '2026' },
        empty: {},
        merge,
      }),
    ).to.deep.equal({ value: { yir: '2026' }, shouldUpload: false });
  });

  it('should upload the merge when local adds to the server state', () => {
    expect(
      reconcileClientState({
        local: { welcome: 'dismissed' },
        remote: { yir: '2026' },
        empty: {},
        merge,
      }),
    ).to.deep.equal({
      value: { yir: '2026', welcome: 'dismissed' },
      shouldUpload: true,
    });
  });
});
