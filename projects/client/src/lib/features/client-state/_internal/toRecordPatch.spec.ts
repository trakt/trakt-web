import { describe, expect, it } from 'vitest';
import { toRecordPatch } from './toRecordPatch.ts';

describe('toRecordPatch', () => {
  it('should send only new and changed entries', () => {
    expect(toRecordPatch({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })).to.deep.equal({
      b: 3,
      c: 4,
    });
  });

  it('should send removed entries as null', () => {
    expect(toRecordPatch({ a: 1, b: 2 }, { a: 1 })).to.deep.equal({ b: null });
  });

  it('should send nothing when the record is unchanged', () => {
    expect(toRecordPatch({ a: { at: 1 } }, { a: { at: 1 } })).to.deep.equal({});
  });
});
