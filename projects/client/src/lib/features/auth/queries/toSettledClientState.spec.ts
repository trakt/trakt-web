import { describe, expect, it } from 'vitest';
import { toSettledClientState } from './toSettledClientState.ts';

describe('toSettledClientState', () => {
  it('should return the loaded state', () => {
    expect(
      toSettledClientState({ data: { a: 1 }, fetchStatus: 'idle' }),
    ).to.deep.equal({ a: 1 });
  });

  it('should keep waiting while the first read is in flight', () => {
    expect(toSettledClientState({ data: undefined, fetchStatus: 'fetching' }))
      .to.equal(undefined);
  });

  it('should settle on null when the read is paused offline', () => {
    expect(toSettledClientState({ data: undefined, fetchStatus: 'paused' }))
      .to.equal(null);
  });

  it('should settle on null when the read failed or never ran', () => {
    expect(toSettledClientState({ data: undefined, fetchStatus: 'idle' }))
      .to.equal(null);
  });
});
