import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { parseRecordEntries } from './parseRecordEntries.ts';

describe('parseRecordEntries', () => {
  const schema = parseRecordEntries(z.number());

  it('should keep every valid entry', () => {
    expect(schema.safeParse({ a: 1, b: 2 }).data).to.deep.equal({ a: 1, b: 2 });
  });

  it('should drop only the entries that do not match', () => {
    expect(
      schema.safeParse({ a: 1, b: 'two', c: { at: 3 } }).data,
    ).to.deep.equal({ a: 1 });
  });

  it('should refuse a value that is not a record', () => {
    expect(schema.safeParse([1, 2]).success).to.equal(false);
    expect(schema.safeParse('all').success).to.equal(false);
  });
});
