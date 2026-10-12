import { describe, expect, it } from 'vitest';
import { latest } from '../merge/latest.ts';
import { mergeRecords } from './mergeRecords.ts';

const preferRemote = (_: string, remote: string) => remote;

describe('mergeRecords', () => {
  it('should keep entries from both sides', () => {
    expect(
      mergeRecords({
        local: { a: '1' },
        remote: { b: '2' },
        mergeEntry: preferRemote,
      }),
    ).to.deep.equal({ b: '2', a: '1' });
  });

  it('should merge entries both sides have', () => {
    expect(
      mergeRecords({
        local: { a: 'local' },
        remote: { a: 'server' },
        mergeEntry: preferRemote,
      }),
    ).to.deep.equal({ a: 'server' });
    expect(
      mergeRecords({ local: { a: 40 }, remote: { a: 30 }, mergeEntry: latest }),
    ).to.deep.equal({ a: 40 });
  });
});
